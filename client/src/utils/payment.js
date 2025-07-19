// Payment utility functions for Stripe integration

export const createPaymentIntent = async (courseId) => {
    try {
        const response = await fetch('/api/user/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId }),
            credentials: 'include'
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

export const confirmPayment = async (paymentIntentId) => {
    try {
        const response = await fetch('/api/user/confirm-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId }),
            credentials: 'include'
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error('Error confirming payment:', error);
        throw error;
    }
};

export const processStripePayment = async (courseId, stripe, elements, cardElement) => {
    try {
        // Create payment intent
        const { clientSecret, paymentIntentId } = await createPaymentIntent(courseId);

        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    // Add billing details if needed
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        if (paymentIntent.status === 'succeeded') {
            // Confirm payment on backend
            await confirmPayment(paymentIntentId);
            return { success: true, message: 'Payment successful!' };
        } else {
            throw new Error('Payment failed');
        }

    } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
    }
}; 