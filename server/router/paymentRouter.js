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

        console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
        console.log('Creating order with:', { amount, currency, receipt });

        if (!amount || !currency || !receipt) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const options = {
            amount: Math.round(amount * 100),   // Razorpay accepts amount in paise (INR) as integer
            currency,
            receipt,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        console.log('Order created successfully:', order);
        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
});

// ✅ Route to verify payment signature
paymentRouter.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;

        console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = hmac.digest('hex');

        if (digest === razorpay_signature) {
            console.log('Payment verified successfully');
            
            // If booking details provided, create the booking
            if (bookingDetails) {
                const riderModel = require('../models/bookride');
                const booking = new riderModel({
                    vehicleId: bookingDetails.vehicleId,
                    userId: bookingDetails.userId,
                    startAddress: bookingDetails.startAddress,
                    endAddress: bookingDetails.endAddress,
                    fare: bookingDetails.totalCost,
                    totalDistance: bookingDetails.distance,
                    status: 'Booked',
                    paymentStatus: 'paid',
                });
                await booking.save();
                console.log('Booking created:', booking._id);
            }
            
            res.status(200).json({ 
                message: 'Payment verified successfully', 
                paymentId: razorpay_payment_id 
            });
        } else {
            console.log('Payment verification failed - signature mismatch');
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        res.status(500).json({ error: 'Payment verification error', details: error.message });
    }
});

module.exports = paymentRouter;
