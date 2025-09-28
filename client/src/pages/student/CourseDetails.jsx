import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import axios from 'axios';
import { FaTimes, FaCreditCard, FaUniversity, FaWallet, FaGooglePay, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import { SiPaytm, SiPhonepe, SiAmazonpay } from 'react-icons/si';
import { MdOutlinePayment } from 'react-icons/md';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    allCourses,
    enrolledCourses,
    setEnrolledCourses,
    loading,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency = '$',
  } = useContext(AppContext);

  useEffect(() => {
    if (!courseData) {
      const course = allCourses.find((c) => c._id === id);
      setCourseData(course);
    }
  }, [allCourses, id, courseData]);

  if (loading) return <Loading />;
  if (!courseData) return <div className="text-center py-10 text-red-600">Course not found</div>;

  const rating = 4.2;
  const totalRatings = 189;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const toggleChapter = (index) => setOpenChapters((prev) => ({ ...prev, [index]: !prev[index] }));

  const discountedPrice = (
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2);

  const isEnrolled = enrolledCourses.some((course) => course._id === id);

  // Enrollment function for both free and paid courses
  const handleEnroll = async (paid = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEnrollmentMessage('Please sign in to enroll in this course');
      navigate('/login');
      return;
    }

    if (!courseData) {
      setEnrollmentMessage('Course not found');
      return;
    }

    if (isEnrolled) {
      navigate(`/player/${id}`);
      return;
    }

    if (!courseData.isFree && courseData.coursePrice > 0 && !paid) {
      setShowPaymentModal(true);
      return;
    }

    setEnrolling(true);
    setEnrollmentMessage(
      courseData.isFree || paid ? 'Enrolling you in the course...' : 'Processing payment...'
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/purchase-course`,
        {
          courseId: courseData._id,
          paymentSuccess: paid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setEnrollmentMessage('Successfully enrolled! Redirecting...');
        setEnrolledCourses((prev) => [...prev, courseData]);
        setTimeout(() => navigate(`/player/${id}`), 1500);
      } else {
        setEnrollmentMessage(response.data.message || 'Failed to enroll');
      }
    } catch (error) {
      setEnrollmentMessage(
        error.response?.data?.message || error.message || 'Failed to enroll'
      );
    } finally {
      setEnrolling(false);
    }
  };

  // Simulated Payment Modal
  function PaymentModal({ isOpen, onClose, course, currency, onSuccess }) {
    const [selectedTab, setSelectedTab] = useState('card');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [upiId, setUpiId] = useState('');
    const [selectedUpiApp, setSelectedUpiApp] = useState('');
    const [netBank, setNetBank] = useState('');
    const [wallet, setWallet] = useState('');
    const [payLater, setPayLater] = useState('');
    const [emiBank, setEmiBank] = useState('');
    const [emiTenure, setEmiTenure] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    if (!isOpen || !course) return null;

    const discountedPrice = (
      course.coursePrice -
      (course.discount * course.coursePrice) / 100
    ).toFixed(2);

    const handlePayNow = async () => {
      setError('');
      setIsProcessing(true);

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address');
        setIsProcessing(false);
        return;
      }

      let valid = false;

      switch (selectedTab) {
        case 'card':
          if (!cardName) {
            setError('Please enter the name on card');
            setIsProcessing(false);
            return;
          }
          if (!cardNumber || cardNumber.length < 16 || !/^\d+$/.test(cardNumber)) {
            setError('Please enter a valid 16-digit card number');
            setIsProcessing(false);
            return;
          }
          if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            setError('Please enter a valid expiry date (MM/YY)');
            setIsProcessing(false);
            return;
          }
          if (!cvv || cvv.length < 3 || !/^\d+$/.test(cvv)) {
            setError('Please enter a valid CVV');
            setIsProcessing(false);
            return;
          }
          valid = true;
          break;
        case 'upi':
          if (selectedUpiApp) {
            valid = true;
          } else if (!upiId || !/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
            setError('Please enter a valid UPI ID (e.g., name@bank) or select an app');
            setIsProcessing(false);
            return;
          } else {
            valid = true;
          }
          break;
        case 'netbanking':
          if (!netBank) {
            setError('Please select a bank');
            setIsProcessing(false);
            return;
          }
          valid = true;
          break;
        case 'wallet':
          if (!wallet) {
            setError('Please select a wallet');
            setIsProcessing(false);
            return;
          }
          valid = true;
          break;
        case 'paylater':
          if (!payLater) {
            setError('Please select a Pay Later option');
            setIsProcessing(false);
            return;
          }
          valid = true;
          break;
        case 'emi':
          if (!emiBank) {
            setError('Please select a bank for EMI');
            setIsProcessing(false);
            return;
          }
          if (!emiTenure) {
            setError('Please select EMI tenure');
            setIsProcessing(false);
            return;
          }
          valid = true;
          break;
        default:
          setError('Invalid payment method');
          setIsProcessing(false);
          return;
      }

      if (valid) {
        setTimeout(async () => {
          try {
            await handleEnroll(true);
            setIsProcessing(false);
            onSuccess();
            onClose();
          } catch (err) {
            setError('Failed to process payment');
            setIsProcessing(false);
          }
        }, 1500);
      }
    };

    return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl transform transition-transform duration-300 scale-100">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg width="96" height="20" viewBox="0 0 122.88 26.53" style={{ enableBackground: 'new 0 0 122.88 26.53' }}>
                <style>{`.st0{fill:#3395FF;}.st1{fill:#072654;}`}</style>
                <g>
                  <polygon className="st1" points="11.19,9.03 7.94,21.47 0,21.47 1.61,15.35 11.19,9.03" />
                  <path className="st1" d="M28.09,5.08C29.95,5.09,31.26,5.5,32,6.33s0.92,2.01,0.51,3.56c-0.27,1.06-0.82,2.03-1.59,2.8 c-0.8,0.8-1.78,1.38-2.87,1.68c0.83,0.19,1.34,0.78,1.5,1.79l0.03,0.22l0.6,5.09h-3.7l-0.62-5.48c-0.01-0.18-0.06-0.36-0.15-0.52 c-0.09-0.16-0.22-0.29-0.37-0.39c-0.31-0.16-0.65-0.24-1-0.25h-0.21h-2.28l-1.74,6.63h-3.46l4.3-16.38H28.09L28.09,5.08z M122.88,9.37l-4.4,6.34l-5.19,7.52l-0.04,0.04l-1.16,1.68l-0.04,0.06L112,25.09l-1,1.44h-3.44l4.02-5.67l-1.82-11.09h3.57 l0.9,7.23l4.36-6.19l0.06-0.09l0.07-0.1l0.07-0.09l0.54-1.15H122.88L122.88,9.37z M92.4,10.25c0.66,0.56,1.09,1.33,1.24,2.19 c0.18,1.07,0.1,2.18-0.21,3.22c-0.29,1.15-0.78,2.23-1.46,3.19c-0.62,0.88-1.42,1.61-2.35,2.13c-0.88,0.48-1.85,0.73-2.85,0.73 c-0.71,0.03-1.41-0.15-2.02-0.51c-0.47-0.28-0.83-0.71-1.03-1.22l-0.06-0.2l-1.77,6.75h-3.43l3.51-13.4l0.02-0.06l0.01-0.06 l0.86-3.25h3.35l-0.57,1.88l-0.01,0.08c0.49-0.7,1.15-1.27,1.91-1.64c0.76-0.4,1.6-0.6,2.45-0.6C90.84,9.43,91.7,9.71,92.4,10.25 L92.4,10.25z M88.26,12.11c-0.4-0.01-0.8,0.07-1.18,0.22c-0.37,0.15-0.71,0.38-1,0.66c-0.68,0.7-1.15,1.59-1.36,2.54 c-0.3,1.11-0.28,1.95,0.02,2.53c0.3,0.58,0.87,0.88,1.72,0.88c0.81,0.02,1.59-0.29,2.18-0.86c0.66-0.69,1.12-1.55,1.33-2.49 c0.29-1.09,0.27-1.96-0.03-2.57S89.08,12.11,88.26,12.11L88.26,12.11z M103.66,9.99c0.46,0.29,0.82,0.72,1.02,1.23l0.07,0.19 l0.44-1.66h3.36l-3.08,11.7h-3.37l0.45-1.73c-0.51,0.61-1.15,1.09-1.87,1.42c-0.7,0.32-1.45,0.49-2.21,0.49 c-0.88,0.04-1.76-0.21-2.48-0.74c-0.66-0.52-1.1-1.28-1.24-2.11c-0.18-1.06-0.12-2.14,0.19-3.17c0.3-1.15,0.8-2.24,1.49-3.21 c0.63-0.89,1.44-1.64,2.38-2.18c0.86-0.5,1.84-0.77,2.83-0.77C102.36,9.43,103.06,9.61,103.66,9.99L103.66,9.99z M101.92,12.14 c-0.41,0-0.82,0.08-1.19,0.24c-0.38,0.16-0.72,0.39-1.01,0.68c-0.67,0.71-1.15,1.59-1.36,2.55c-0.28,1.08-0.28,1.9,0.04,2.49 c0.31,0.59,0.89,0.87,1.75,0.87c0.4,0.01,0.8-0.07,1.18-0.22s0.71-0.38,1-0.66c0.59-0.63,1.02-1.38,1.26-2.22l0.08-0.31 c0.3-1.11,0.29-1.96-0.03-2.53C103.33,12.44,102.76,12.14,101.92,12.14L101.92,12.14z M81.13,9.63l0.22,0.09l-0.86,3.19 c-0.49-0.26-1.03-0.39-1.57-0.39c-0.82-0.03-1.62,0.24-2.27,0.75c-0.56,0.48-0.97,1.12-1.18,1.82l-0.07,0.27l-1.6,6.11h-3.42 l3.1-11.7h3.37l-0.44,1.72c0.42-0.58,0.96-1.05,1.57-1.4c0.68-0.39,1.44-0.59,2.22-0.59C80.51,9.48,80.83,9.52,81.13,9.63 L81.13,9.63z M68.5,10.19c0.76,0.48,1.31,1.24,1.52,2.12c0.25,1.06,0.21,2.18-0.11,3.22c-0.3,1.18-0.83,2.28-1.58,3.22 c-0.71,0.91-1.61,1.63-2.64,2.12c-1.05,0.49-2.19,0.74-3.35,0.73c-1.22,0-2.22-0.24-3-0.73c-0.77-0.48-1.32-1.24-1.54-2.12 c-0.24-1.06-0.2-2.18,0.11-3.22c0.3-1.17,0.83-2.27,1.58-3.22c0.71-0.9,1.62-1.63,2.66-2.12c1.06-0.49,2.22-0.75,3.39-0.73 C66.57,9.41,67.6,9.67,68.5,10.19L68.5,10.19z M64.84,12.1c-0.81-0.01-1.59,0.3-2.18,0.86c-0.61,0.58-1.07,1.43-1.36,2.57 c-0.6,2.29-0.02,3.43,1.74,3.43c0.8,0.02,1.57-0.29,2.15-0.85c0.6-0.57,1.04-1.43,1.34-2.58c0.3-1.13,0.31-1.98,0.01-2.57 C66.25,12.37,65.68,12.1,64.84,12.1L64.84,12.1z M57.89,9.76l-0.6,2.32l-7.55,6.67h6.06l-0.72,2.73H45.05l0.63-2.41l7.43-6.57 h-5.65l0.72-2.73H57.89L57.89,9.76z M40.96,9.99c0.46,0.29,0.82,0.72,1.02,1.23l0.07,0.19l0.44-1.66h3.37l-3.07,11.7h-3.37 l0.45-1.73c-0.51,0.6-1.14,1.08-1.85,1.41s-1.48,0.5-2.27,0.5c-0.88,0.04-1.74-0.22-2.45-0.74c-0.66-0.52-1.1-1.28-1.24-2.11 c-0.18-1.06-0.12-2.14,0.19-3.17c0.29-1.15,0.8-2.24,1.49-3.21c0.63-0.89,1.44-1.64,2.37-2.18c0.86-0.5,1.84-0.76,2.83-0.76 C39.66,9.44,40.36,9.62,40.96,9.99L40.96,9.99z M39.23,12.14c-0.41,0-0.81,0.08-1.19,0.24c-0.38,0.16-0.72,0.39-1.01,0.68 c-0.68,0.71-1.15,1.59-1.36,2.55c-0.28,1.08-0.27,1.9,0.04,2.49c0.31,0.59,0.89,0.87,1.75,0.87c0.4,0.01,0.8-0.07,1.18-0.22 c0.37-0.15,0.72-0.38,1-0.66c0.59-0.62,1.03-1.38,1.26-2.22l0.08-0.31c0.29-1.11,0.26-1.94-0.03-2.53 C40.64,12.44,40.06,12.14,39.23,12.14L39.23,12.14z M26.85,7.81h-3.21l-1.13,4.28h3.21c1.01,0,1.81-0.17,2.35-0.52 c0.57-0.37,0.98-0.95,1.13-1.63c0.2-0.72,0.11-1.27-0.27-1.62C28.55,7.99,27.86,7.81,26.85,7.81L26.85,7.81z" />
                  <polygon className="st0" points="18.4,0 12.76,21.47 8.89,21.47 12.7,6.93 6.86,10.78 7.9,6.95 18.4,0" />
                </g>
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Secure Payment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email (for receipt)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 placeholder-gray-400 transition-all"
            />
          </div>

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200 flex justify-between items-center">
            <div>
              <h3 className="text-md font-semibold text-gray-800">{course.courseTitle}</h3>
              <p className="text-xs text-gray-600">Order ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <p className="text-md font-bold text-blue-600">{currency}{discountedPrice}</p>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 mb-5 gap-1">
            <button
              onClick={() => setSelectedTab('card')}
              className={`flex items-center px-3 py-2 font-medium text-sm ${selectedTab === 'card' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <FaCreditCard className="mr-1" /> Card
            </button>
            <button
              onClick={() => setSelectedTab('upi')}
              className={`flex items-center px-3 py-2 font-medium text-sm ${selectedTab === 'upi' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <FaGooglePay className="mr-1" /> UPI
            </button>
            <button
              onClick={() => setSelectedTab('netbanking')}
              className={`flex items-center px-3 py-2 font-medium text-sm ${selectedTab === 'netbanking' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <FaUniversity className="mr-1" /> Netbanking
            </button>
            <button
              onClick={() => setSelectedTab('wallet')}
              className={`flex items-center px-3 py-2 font-medium text-sm ${selectedTab === 'wallet' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <FaWallet className="mr-1" /> Wallet
            </button>
            <button
              onClick={() => setSelectedTab('paylater')}
              className={`flex items-center px-3 py-2 font-medium text-sm ${selectedTab === 'paylater' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <MdOutlinePayment className="mr-1" /> Pay Later
            </button>
            <button
              onClick={() => setSelectedTab('emi')}
              className={`flex items-center px-3 py-2 font-medium text-sm ${selectedTab === 'emi' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <MdOutlinePayment className="mr-1" /> EMI
            </button>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            {selectedTab === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 placeholder-gray-400 transition-all"
                      maxLength="16"
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <FaCcVisa className="h-5 w-5 text-gray-500" />
                      <FaCcMastercard className="h-5 w-5 text-gray-500" />
                      <FaCcAmex className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 placeholder-gray-400 transition-all"
                      maxLength="5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 placeholder-gray-400 transition-all"
                      maxLength="4"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 placeholder-gray-400 transition-all"
                  />
                </div>
              </>
            )}
            {selectedTab === 'upi' && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    onClick={() => setSelectedUpiApp('gpay')}
                    className={`p-3 border rounded-md flex items-center justify-center ${selectedUpiApp === 'gpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                  >
                    <FaGooglePay className="h-8 w-8 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedUpiApp('phonepe')}
                    className={`p-3 border rounded-md flex items-center justify-center ${selectedUpiApp === 'phonepe' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                  >
                    <SiPhonepe className="h-8 w-8 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedUpiApp('paytm')}
                    className={`p-3 border rounded-md flex items-center justify-center ${selectedUpiApp === 'paytm' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                  >
                    <SiPaytm className="h-8 w-8 text-gray-700" />
                  </button>
                </div>
                {!selectedUpiApp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Or enter UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@bank"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 placeholder-gray-400 transition-all"
                    />
                  </div>
                )}
              </>
            )}
            {selectedTab === 'netbanking' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Bank
                </label>
                <select
                  value={netBank}
                  onChange={(e) => setNetBank(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 transition-all"
                >
                  <option value="">Select a bank</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                  <option value="yes">Yes Bank</option>
                  <option value="indusind">IndusInd Bank</option>
                  <option value="pnb">Punjab National Bank</option>
                </select>
              </div>
            )}
            {selectedTab === 'wallet' && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setWallet('paytm')}
                  className={`p-3 border rounded-md flex items-center justify-center ${wallet === 'paytm' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                >
                  <SiPaytm className="h-8 w-8 text-gray-700" />
                </button>
                <button
                  onClick={() => setWallet('phonepe')}
                  className={`p-3 border rounded-md flex items-center justify-center ${wallet === 'phonepe' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                >
                  <SiPhonepe className="h-8 w-8 text-gray-700" />
                </button>
                <button
                  onClick={() => setWallet('amazonpay')}
                  className={`p-3 border rounded-md flex items-center justify-center ${wallet === 'amazonpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                >
                  <SiAmazonpay className="h-8 w-8 text-gray-700" />
                </button>
                <button
                  onClick={() => setWallet('mobikwik')}
                  className={`p-3 border rounded-md flex items-center justify-center ${wallet === 'mobikwik' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                >
                  <img src={assets.mobikwik_logo} alt="MobiKwik" className="h-8 w-8" />
                </button>
              </div>
            )}
            {selectedTab === 'paylater' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPayLater('lazypay')}
                  className={`p-3 border rounded-md flex items-center justify-center ${payLater === 'lazypay' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                >
                  <img src={assets.lazypay_logo} alt="LazyPay" className="h-8" />
                </button>
                <button
                  onClick={() => setPayLater('olapostpaid')}
                  className={`p-3 border rounded-md flex items-center justify-center ${payLater === 'olapostpaid' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'}`}
                >
                  <img src={assets.olapostpaid_logo} alt="OLA Postpaid" className="h-8" />
                </button>
              </div>
            )}
            {selectedTab === 'emi' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Select Bank
                  </label>
                  <select
                    value={emiBank}
                    onChange={(e) => setEmiBank(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700"
                  >
                    <option value="">Select a bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="icici">ICICI Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Select Tenure
                  </label>
                  <select
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700"
                  >
                    <option value="">Select tenure</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
              </>
            )}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className={`w-full mt-6 py-3 rounded-md font-semibold text-white transition-all duration-200 ${
              isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Processing...' : `Pay ${currency}${discountedPrice}`}
          </button>

          {/* Razorpay Branding */}
          <div className="mt-2 text-center text-xs text-gray-500">
            <span>Powered by </span>
            <span className="font-semibold text-blue-600">Razorpay</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-6 md:pt-30 pt-20 text-left mb-15 bg-gradient-to-b from-emerald-100">
        <div className="absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-emerald-100/70" />
        <div className="max-w-3xl z-10 text-gray-700 space-y-6 bg-white/50 rounded-xl p-6 shadow-md backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-gray-800">{courseData.courseTitle}</h1>
          <p className="text-lg text-gray-700">
            {showFullDesc ? (
              <span dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 270) }} />
            )}
            {courseData.courseDescription.length > 270 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-emerald-600 underline ml-1"
              >
                {showFullDesc ? 'View Less' : 'View More'}
              </button>
            )}
          </p>
          <section className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
            <div className="space-y-4">
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleChapter(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-5 h-5 transform transition-transform duration-200 ${openChapters[index] ? 'rotate-180' : ''}`}
                      />
                      <h3 className="font-medium text-gray-800">{chapter.chapterTitle}</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                    </span>
                  </div>
                  {openChapters[index] && (
                    <ul className="mt-3 space-y-2">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <img src={assets.play_icon} alt="play" className="w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{lecture.lectureTitle}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {lecture.isPreviewFree && (
                                <span className="px-1.5 py-0.5 border border-emerald-500 text-emerald-500 rounded">
                                  Preview
                                </span>
                              )}
                              <span>
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                  units: ['h', 'm'],
                                  round: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="w-full md:w-[320px] bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-6 z-10 space-y-4">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
            <img src={courseData.courseThumbnail} alt="Course Preview" className="object-cover w-full h-full" />
          </div>
          <p className="text-sm text-gray-600">
            {calculateNoOfLectures(courseData)} lectures • {calculateCourseDuration(courseData)}
          </p>
          {courseData.isFree || courseData.coursePrice === 0 ? (
            <p className="text-xl font-semibold text-green-700">FREE</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 line-through">
                {currency}
                {courseData.coursePrice.toFixed(2)}
              </p>
              <p className="text-sm text-emerald-600 font-semibold">{courseData.discount}% OFF</p>
              <p className="text-xl font-semibold text-emerald-700">
                Price: {currency}
                {discountedPrice}
              </p>
            </>
          )}
          {enrollmentMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                enrollmentMessage.toLowerCase().includes('success')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {enrollmentMessage}
            </div>
          )}
          <button
            onClick={() => handleEnroll()}
            disabled={enrolling}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              isEnrolled
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : courseData.isFree || courseData.coursePrice === 0
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isEnrolled
              ? 'Continue Learning'
              : courseData.isFree || courseData.coursePrice === 0
              ? 'Enroll for Free'
              : 'Pay & Enroll'}
          </button>
        </aside>
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={courseData}
        currency={currency}
        onSuccess={() => setShowPaymentModal(false)}
      />
      <Footer />
    </>
  );
}

export default CourseDetails;