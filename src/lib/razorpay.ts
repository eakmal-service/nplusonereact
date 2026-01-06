
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
    console.warn("Razorpay keys are missing. Payments will fail.");
}

export const razorpay = new Razorpay({
    key_id: key_id || 'test_key_id', // Fallback to avoid crash during build/dev if keys missing
    key_secret: key_secret || 'test_key_secret',
});
