import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn(
    '⚠️  RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not found in environment variables. Razorpay functionality will be disabled.'
  );
  razorpay = null;
} else {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
  console.log('✅ Razorpay configured successfully');
}

export default razorpay;
