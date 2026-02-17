import { useState, useCallback, useRef, useEffect } from 'react';
import PaymentGateway from '../services/paymentGateway';

/**
 * usePayment — React hook that encapsulates the Razorpay payment workflow.
 *
 * Replicated from the vendor-dashboard's PaymentModal component logic,
 * refactored as a headless hook so any component can drive the flow.
 *
 * Usage:
 *   const { pay, loading, error, status } = usePayment({ onSuccess, onFailure });
 *   <button onClick={() => pay({ amount: 499, referenceId: courseId })} disabled={loading}>
 *     Pay ₹499
 *   </button>
 */
export default function usePayment({ onSuccess, onFailure, onDismiss } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | success | failed
  const [sdkReady, setSdkReady] = useState(false);
  const mountedRef = useRef(true);

  // Pre-load SDK on mount (mirrors vendor-dashboard useEffect)
  useEffect(() => {
    mountedRef.current = true;

    PaymentGateway.loadRazorpaySDK()
      .then(() => {
        if (mountedRef.current) setSdkReady(true);
      })
      .catch((err) => {
        console.warn('Razorpay SDK preload failed:', err.message);
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Initiate a payment.
   *
   * @param {object}  opts
   * @param {number}  opts.amount
   * @param {string}  opts.referenceId
   * @param {string}  [opts.referenceType='course']
   * @param {string}  [opts.currency='INR']
   * @param {object}  [opts.metadata]
   * @param {object}  [opts.prefill]       { name, email, contact }
   * @param {string}  [opts.description]
   * @param {string}  [opts.themeColor]
   */
  const pay = useCallback(
    async (opts) => {
      setLoading(true);
      setError(null);
      setStatus('processing');

      await PaymentGateway.initiateCheckout({
        ...opts,
        onSuccess: (result) => {
          if (mountedRef.current) {
            setLoading(false);
            setStatus('success');
          }
          onSuccess?.(result);
        },
        onFailure: (err) => {
          if (mountedRef.current) {
            setLoading(false);
            setError(err.message || 'Payment failed');
            setStatus('failed');
          }
          onFailure?.(err);
        },
        onDismiss: () => {
          if (mountedRef.current) {
            setLoading(false);
            setStatus('idle');
          }
          onDismiss?.();
        },
      });
    },
    [onSuccess, onFailure, onDismiss]
  );

  /** Reset the hook back to idle state. */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setStatus('idle');
  }, []);

  return { pay, loading, error, status, sdkReady, reset };
}
