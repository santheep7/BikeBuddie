const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const paymentRouter = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_AQz9oVZHhqMI1R',   // Replace with your Razorpay Test Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'Sj5CF71O3PvsM5Aex3Q2AtOk'  // Replace with your Razorpay Test Key Secret
});

// ✅ Route to create a new order
paymentRouter.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;

        if (!amount || !currency || !receipt) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const options = {
            amount: amount * 100,   // Razorpay accepts amount in paise (INR)
            currency,
            receipt,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// ✅ Route to verify payment signature
paymentRouter.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');

    if (digest === razorpay_signature) {
        res.status(200).json({ message: 'Payment verified successfully', paymentId: razorpay_payment_id });
    } else {
        res.status(400).json({ error: 'Invalid payment signature' });
    }
});

module.exports = paymentRouter;
