import Course from '../models/Course.js';
import User from '../models/User.js';

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

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

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
      // free course enrollment — update both User and Course for consistency
      user.enrolledCourses = user.enrolledCourses || [];
      user.enrolledCourses.push(courseId);
      await user.save();

      // Also add student to course.enrolledStudent (mirrors paid flow)
      if (!course.enrolledStudent?.map(String).includes(userId.toString())) {
        course.enrolledStudent = course.enrolledStudent || [];
        course.enrolledStudent.push(userId);
        await course.save();
      }

      return res.json({
        success: true,
        message: 'Enrolled in free course successfully',
        enrolledCourses: user.enrolledCourses,
        courseData: course,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Paid course enrollment requires Razorpay checkout via /api/payments routes',
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
