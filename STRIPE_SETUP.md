# Stripe Integration Setup Guide

## Overview
This project now includes complete Stripe payment integration for course purchases. The integration includes payment intent creation, payment confirmation, and webhook handling.

## Environment Variables Required

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## API Endpoints

### 1. Create Payment Intent
- **URL**: `POST /api/user/create-payment-intent`
- **Body**: `{ "courseId": "course_id_here" }`
- **Response**: 
  ```json
  {
    "success": true,
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
  ```

### 2. Confirm Payment
- **URL**: `POST /api/user/confirm-payment`
- **Body**: `{ "paymentIntentId": "pi_xxx" }`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Payment confirmed and course enrolled successfully"
  }
  ```

### 3. Stripe Webhook
- **URL**: `POST /api/stripe/webhook`
- **Purpose**: Handles payment success/failure events from Stripe

## Frontend Integration

### 1. Install Stripe.js
```bash
npm install @stripe/stripe-js
```

### 2. Initialize Stripe
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key_here');
```

### 3. Use Payment Utility
```javascript
import { processStripePayment } from '../utils/payment.js';

// In your component
const handlePayment = async () => {
    try {
        const stripe = await stripePromise;
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        
        const result = await processStripePayment(courseId, stripe, elements, cardElement);
        console.log('Payment successful:', result);
    } catch (error) {
        console.error('Payment failed:', error);
    }
};
```

## Database Models

### Purchase Model
The system uses a `Purchase` model to track payment status:
- `courseId`: Reference to the course
- `userId`: Reference to the user
- `amount`: Payment amount
- `status`: 'pending', 'completed', or 'failed'
- `timestamps`: Created and updated timestamps

## Webhook Setup

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add endpoint: `https://your-domain.com/api/stripe/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the webhook secret to your `.env` file

## Testing

### Test Card Numbers
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Flow
1. Create payment intent with course ID
2. Use test card to complete payment
3. Verify webhook updates purchase status
4. Confirm user is enrolled in course

## Security Notes

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures** (implemented)
3. **Use HTTPS** in production
4. **Validate payment amounts** on backend
5. **Handle failed payments** gracefully

## Error Handling

The integration includes comprehensive error handling for:
- Invalid course IDs
- Duplicate enrollments
- Payment failures
- Webhook verification failures
- Network errors

## Production Checklist

- [ ] Set up production Stripe keys
- [ ] Configure webhook endpoint for production
- [ ] Test payment flow with real cards
- [ ] Set up proper error monitoring
- [ ] Configure webhook retry logic
- [ ] Set up payment analytics
- [ ] Test refund process if needed 