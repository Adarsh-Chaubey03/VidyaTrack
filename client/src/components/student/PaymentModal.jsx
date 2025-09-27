import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { apiService } from '../../services/api.js';
import { useAuth } from '@clerk/clerk-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ isOpen, onClose, course, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userId } = useAuth();

  const handlePayment = async () => {
    if (!course) return;
    if (!userId) {
      setError('Please sign in to make a payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const paymentIntentResult = await apiService.user.createPaymentIntent({ courseId: course._id });
      
      if (!paymentIntentResult.success) {
        throw new Error(paymentIntentResult.message || 'Failed to create payment intent');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: paymentIntentResult.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    if (!course) return;
    if (!userId) {
      setError('Please sign in to make a payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For demo purposes, simulate a successful payment
      const result = await apiService.user.purchaseCourse({ courseId: course._id });
      
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Test payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const discountedPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={course.courseThumbnail} 
              alt={course.courseTitle}
              className="w-16 h-12 object-cover rounded"
            />
            <div>
              <h3 className="font-medium text-gray-800">{course.courseTitle}</h3>
              <p className="text-sm text-gray-500">
                {course.courseDescription?.replace(/<[^>]*>/g, '').slice(0, 50)}...
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Original Price:</span>
              <span className="text-gray-500 line-through">${course.coursePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Discount:</span>
              <span className="text-green-600">{course.discount}% OFF</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-800">Total:</span>
              <span className="text-emerald-600">${discountedPrice}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay with Card'}
          </button>

          <button
            onClick={handleTestPayment}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Test Payment (Demo)'}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Secure payment powered by Stripe</p>
          <p>For demo purposes, you can use the "Test Payment" button</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 