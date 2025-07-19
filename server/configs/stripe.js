import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Check if Stripe key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe;

if (!stripeSecretKey) {
    console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables. Stripe functionality will be disabled.');
    // Create a mock stripe object for development
    stripe = {
        paymentIntents: {
            create: async () => {
                throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
            },
            retrieve: async () => {
                throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
            }
        },
        webhooks: {
            constructEvent: () => {
                throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
            }
        }
    };
} else {
    stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2024-12-18.acacia',
    });
    
    console.log('✅ Stripe configured successfully');
}

export default stripe; 