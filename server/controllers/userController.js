import Course from '../models/Course.js';
import User from '../models/User.js';
import Purchase from '../models/Purchase.js';
import stripe from '../configs/stripe.js';

// Get user data
export const getUserData = async (req, res) => {
  try {
    const user = req.user; // User is already attached by auth middleware

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error getting user data:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// User enrolled courses with lecture link
export const userEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, enrolledCourses: user.enrolledCourses || [] });
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Stripe checkout session for course purchase
export const createPaymentIntent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    // Get course data
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses && user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Only create payment intent for paid courses
    if (course.isFree || course.coursePrice === 0) {
      return res.status(400).json({ success: false, message: 'This is a free course. Use the free enrollment endpoint.' });
    }

    const discountedPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100) * 100; // Convert to cents

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.courseTitle,
              description: course.courseDescription?.slice(0, 100) + '...',
              images: [course.courseThumbnail],
            },
            unit_amount: Math.round(discountedPrice),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CORS_ORIGIN || 'http://localhost:5174'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN || 'http://localhost:5174'}/course/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
    });

    // Create purchase record
    const purchase = new Purchase({
      courseId: courseId,
      userId: userId,
      amount: discountedPrice / 100,
      status: 'pending',
    });
    await purchase.save();

    res.json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm payment and enroll user
export const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user._id;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const courseId = session.metadata.courseId;

      // Update purchase status
      await Purchase.findOneAndUpdate(
        { courseId: courseId, userId: userId },
        { status: 'completed' }
      );

      // Enroll user in course
      const user = await User.findById(userId);
      user.enrolledCourses = user.enrolledCourses || [];
      user.enrolledCourses.push(courseId);
      await user.save();

      res.json({
        success: true,
        message: 'Payment confirmed and course enrolled successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe webhook handler
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const courseId = session.metadata.courseId;
        const userId = session.metadata.userId;

        // Update purchase status
        await Purchase.findOneAndUpdate(
          { courseId: courseId, userId: userId },
          { status: 'completed' }
        );

        // Enroll user in course
        const user = await User.findById(userId);
        if (user && !user.enrolledCourses.includes(courseId)) {
          user.enrolledCourses = user.enrolledCourses || [];
          user.enrolledCourses.push(courseId);
          await user.save();
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredCourseId = expiredSession.metadata.courseId;
        const expiredUserId = expiredSession.metadata.userId;

        // Update purchase status to failed
        await Purchase.findOneAndUpdate(
          { courseId: expiredCourseId, userId: expiredUserId },
          { status: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId, paymentSuccess } = req.body; // added paymentSuccess flag

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.enrolledCourses?.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    if (course.isFree || course.coursePrice === 0) {
      // free course enrollment
      user.enrolledCourses = user.enrolledCourses || [];
      user.enrolledCourses.push(courseId);
      await user.save();

      return res.json({
        success: true,
        message: 'Enrolled in free course successfully',
        enrolledCourses: user.enrolledCourses,
        courseData: course,
      });
    }

    // Paid course enrollment
    if (!paymentSuccess) {
      return res.status(400).json({
        success: false,
        message: 'Payment required to enroll in this course',
      });
    }

    // Payment was successful → enroll course
    user.enrolledCourses = user.enrolledCourses || [];
    user.enrolledCourses.push(courseId);
    await user.save();

    return res.json({
      success: true,
      message: 'Payment confirmed and course enrolled successfully',
      enrolledCourses: user.enrolledCourses,
      courseData: course,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
