import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Verify payment with backend
      verifyPayment();
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch('/api/user/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();

      if (result.success) {
        setLoading(false);
      } else {
        setError(result.message || 'Payment verification failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verifying Payment...</h2>
          <p className="text-gray-500">Please wait while we confirm your purchase</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Payment Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-rose-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You have been successfully enrolled in the course.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-dashboard')}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600"
            >
              View My Dashboard
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Continue Browsing
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Session ID: {sessionId}</p>
            <p>You will receive a confirmation email shortly.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess; 