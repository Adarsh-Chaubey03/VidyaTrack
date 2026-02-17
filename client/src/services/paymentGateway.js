/**
 * PaymentGateway — Razorpay integration service for VidyaTrack.
 *
 * Replicated from the Khatakhat vendor-dashboard PaymentModal pattern,
 * stripped of all e-commerce / vendor / catalog logic, and restructured
 * as a standalone, importable service.
 *
 * Handles:
 *  • Razorpay SDK script loading
 *  • Order creation via backend API
 *  • Opening the Razorpay checkout modal
 *  • Payment confirmation via backend API
 *  • Success / failure callbacks
 */

import api from './api';

// ---------------------------------------------------------------------------
// 1. Razorpay SDK Loader (mirrors vendor-dashboard useEffect pattern)
// ---------------------------------------------------------------------------

let _razorpayLoadPromise = null;

/**
 * Dynamically loads the Razorpay checkout script exactly once.
 * Returns a promise that resolves when `window.Razorpay` is available.
 */
export function loadRazorpaySDK() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay requires a browser environment'));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (_razorpayLoadPromise) return _razorpayLoadPromise;

  _razorpayLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => {
      _razorpayLoadPromise = null;
      reject(new Error('Failed to load Razorpay checkout script'));
    };
    document.body.appendChild(script);
  });

  return _razorpayLoadPromise;
}

// ---------------------------------------------------------------------------
// 2. API Calls (gateway-agnostic shape, Razorpay implementation)
// ---------------------------------------------------------------------------

/**
 * Ask the backend to create a Razorpay order.
 *
 * @param {{ amount: number, referenceId: string, referenceType?: string, currency?: string, metadata?: object }} params
 * @returns {Promise<{ transactionId, razorpayOrderId, razorpayKeyId, amount, currency }>}
 */
export async function createPaymentOrder({
  amount,
  referenceId,
  referenceType = 'course',
  currency = 'INR',
  metadata = {},
}) {
  const response = await api.post('/payments/create-order', {
    amount,
    referenceId,
    referenceType,
    currency,
    metadata,
  });
  return response.data.data;
}

/**
 * Confirm a payment after the Razorpay checkout modal completes.
 *
 * @param {{ razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }} params
 */
export async function confirmPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const response = await api.post('/payments/confirm', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
  return response.data;
}

/**
 * Fetch the current status of a transaction.
 */
export async function getPaymentStatus(transactionId) {
  const response = await api.get(`/payments/status/${transactionId}`);
  return response.data.data;
}

/**
 * Fetch user's payment history.
 */
export async function getPaymentHistory({ status, referenceType, page, limit } = {}) {
  const params = {};
  if (status) params.status = status;
  if (referenceType) params.referenceType = referenceType;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get('/payments/history', { params });
  return response.data.data;
}

// ---------------------------------------------------------------------------
// 3. Checkout Orchestrator
// ---------------------------------------------------------------------------

/**
 * Opens the Razorpay checkout modal and handles the full flow:
 *   createOrder → open modal → confirm payment.
 *
 * @param {object}  opts
 * @param {number}  opts.amount         Amount in base currency (INR)
 * @param {string}  opts.referenceId    ID of the item being purchased
 * @param {string}  [opts.referenceType='course']
 * @param {string}  [opts.currency='INR']
 * @param {object}  [opts.metadata={}]
 * @param {object}  [opts.prefill]      { name, email, contact }
 * @param {string}  [opts.description]
 * @param {string}  [opts.themeColor='#10B981']  Tailwind emerald-500 default
 * @param {() => void}                  opts.onSuccess   Called after confirmation
 * @param {(error: Error) => void}      opts.onFailure   Called on any failure
 * @param {() => void}                  [opts.onDismiss]  Called when modal closed without paying
 */
export async function initiateCheckout({
  amount,
  referenceId,
  referenceType = 'course',
  currency = 'INR',
  metadata = {},
  prefill = {},
  description = 'VidyaTrack Payment',
  themeColor = '#10B981',
  onSuccess,
  onFailure,
  onDismiss,
}) {
  try {
    // Step 1 — Load SDK
    const RazorpayClass = await loadRazorpaySDK();

    // Step 2 — Create order on backend
    const orderData = await createPaymentOrder({
      amount,
      referenceId,
      referenceType,
      currency,
      metadata,
    });

    // Step 3 — Open checkout modal  (replicates vendor-dashboard options object)
    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.amount, // already in paise from backend
      currency: orderData.currency,
      name: 'VidyaTrack',
      description,
      order_id: orderData.razorpayOrderId,

      handler: async (response) => {
        try {
          // Step 4 — Confirm payment on backend
          const result = await confirmPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (result.success) {
            onSuccess?.(result);
          } else {
            onFailure?.(new Error(result.message || 'Payment confirmation failed'));
          }
        } catch (confirmError) {
          console.error('Payment confirmation error:', confirmError);
          onFailure?.(confirmError);
        }
      },

      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: prefill.contact || '',
      },

      theme: { color: themeColor },

      modal: {
        ondismiss: () => {
          onDismiss?.();
        },
      },
    };

    const rzp = new RazorpayClass(options);

    rzp.on('payment.failed', (failedResponse) => {
      console.error('Payment failed:', failedResponse.error);
      onFailure?.(new Error(failedResponse.error?.description || 'Payment failed'));
    });

    rzp.open();
  } catch (error) {
    console.error('Payment initiation error:', error);
    onFailure?.(error);
  }
}

// ---------------------------------------------------------------------------
// Default export — namespace object for convenient importing
// ---------------------------------------------------------------------------

const PaymentGateway = {
  loadRazorpaySDK,
  createPaymentOrder,
  confirmPayment,
  getPaymentStatus,
  getPaymentHistory,
  initiateCheckout,
};

export default PaymentGateway;
