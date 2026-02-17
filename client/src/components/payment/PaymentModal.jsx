import React from 'react';
import usePayment from '../../hooks/usePayment';

/**
 * PaymentModal — Reusable, domain-agnostic payment modal for VidyaTrack.
 *
 * Architectural lineage: Khatakhat vendor-dashboard PaymentModal.tsx
 * All vendor/product/catalog/credit-limit logic stripped.
 * Adapted for education-platform context (courses, subscriptions, etc.).
 *
 * Props:
 *  - isOpen:        boolean
 *  - onClose:       () => void
 *  - onSuccess:     (result) => void
 *  - amount:        number (in base currency units, e.g. INR)
 *  - referenceId:   string (e.g. courseId)
 *  - referenceType: 'course' | 'subscription' | 'test_series' | 'mentorship'
 *  - title:         string displayed in modal header
 *  - description:   string (shown in Razorpay checkout)
 *  - prefill:       { name, email, contact }
 *  - currency:      string (default 'INR')
 *  - metadata:      object (extra data passed to backend)
 */
export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  referenceId,
  referenceType = 'course',
  title = 'Complete Payment',
  description = 'VidyaTrack Payment',
  prefill = {},
  currency = 'INR',
  metadata = {},
}) {
  const { pay, loading, error, status, sdkReady, reset } = usePayment({
    onSuccess: (result) => {
      onSuccess?.(result);
      onClose?.();
    },
    onFailure: () => {
      // error state is set inside the hook
    },
    onDismiss: () => {
      // User closed Razorpay modal without completing
    },
  });

  const handlePay = () => {
    pay({
      amount,
      referenceId,
      referenceType,
      currency,
      metadata,
      prefill,
      description,
      themeColor: '#10B981', // emerald-500
    });
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose?.();
    }
  };

  if (!isOpen) return null;

  const currencySymbol = currency === 'INR' ? '₹' : currency;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden">
        {/* ---- Header ---- */}
        <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              disabled={loading}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ---- Body ---- */}
        <div className="px-6 py-5 space-y-5">
          {/* Amount display */}
          <div className="bg-emerald-50 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-emerald-700">
              {currencySymbol}{amount?.toLocaleString()}
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Payment Failed</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Success display */}
          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-emerald-800">Payment successful! Redirecting...</p>
            </div>
          )}

          {/* SDK status warning */}
          {!sdkReady && !loading && (
            <p className="text-xs text-amber-600 text-center">
              Loading payment gateway...
            </p>
          )}

          {/* Security note */}
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured by Razorpay | 256-bit encryption</span>
          </div>
        </div>

        {/* ---- Footer ---- */}
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 bg-gray-50">
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading || !sdkReady || status === 'success'}
            className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Pay {currencySymbol}{amount?.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
