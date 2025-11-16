const Razorpay = require('razorpay');

const createOrder = async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;

        const options = {
            amount: amount * 100,   // Razorpay accepts amount in paise
            currency: currency || "INR",  // Default to INR if currency is missing
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {}
        };

        console.log("Creating order with options:", options);  // Add logging

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await instance.orders.create(options);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);  // Log detailed error
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
};