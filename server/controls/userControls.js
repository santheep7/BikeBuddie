// userControls.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Razorpay = require('razorpay');

const userModel = require('../models/userModel');
const riderModel = require('../models/bookride');
const vehicleModel = require('../models/bikemodel');
const contactModel = require('../models/contact');

// Razorpay init (keys from env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Email transporter (credentials from env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helpers
const generateOTP = () => String(crypto.randomInt(100000, 999999)); // returns string OTP
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const sendOTPEmail = async (email, otp, subject = 'Your OTP') => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: `Your OTP is: ${otp}. It is valid for ${Math.floor(OTP_TTL_MS / 60000)} minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

// --- Controllers ---

// Register new user (hash password, save OTP, send OTP)
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'fullname, email and password are required' });
    }

    // check duplicate
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiration = Date.now() + OTP_TTL_MS;

    const newUser = new userModel({
      fullname,
      email,
      password: hashedPassword,
      role: role || 'user',
      otp,
      otpExpiration,
      verified: false,
    });

    await newUser.save();

    try {
      await sendOTPEmail(email, otp, 'OTP for BikeBuddie Registration');
    } catch (mailErr) {
      console.error('Failed to send registration OTP:', mailErr);
      // Return created but warn client
      return res.status(201).json({
        message: 'User created but failed to send OTP email. Contact support.',
        warning: mailErr.message,
      });
    }

    return res.status(201).json({ message: 'User registered successfully. OTP sent to email.' });
  } catch (err) {
    console.error('registerUser error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Resend registration OTP (generate new OTP)
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + OTP_TTL_MS;
    await user.save();

    try {
      await sendOTPEmail(email, otp, 'Your new OTP for BikeBuddie');
    } catch (mailErr) {
      console.error('resendOTP mail error:', mailErr);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    return res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('resendOTP error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Verify registration OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'email and otp required' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otpExpiration || Number(user.otpExpiration) < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('verifyOTP error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login endpoint: if called with only { email } -> send OTP; if called with { email, enteredOTP } -> verify here or use verifyOTPLogin below
const loginUser = async (req, res) => {
  try {
    const { email, enteredOTP } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    // If OTP provided in this endpoint (enteredOTP), verify here
    if (enteredOTP) {
      if (!user.otp || Number(user.otpExpiration || 0) < Date.now()) {
        return res.status(400).json({ message: 'OTP expired or not requested' });
      }
      if (String(user.otp) === String(enteredOTP)) {
        // clear OTP
        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();

        const userSafe = user.toObject();
        delete userSafe.password;
        return res.status(200).json({ message: 'Login successful', user: userSafe });
      } else {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
    }

    // No OTP provided -> generate and send new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + OTP_TTL_MS;
    await user.save();

    try {
      await sendOTPEmail(email, otp, 'Your BikeBuddie Login OTP');
    } catch (mailErr) {
      console.error('loginUser sendMail error:', mailErr);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('loginUser error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Verify login OTP endpoint (keeps separate route if frontend uses /user/verify-otplogin)
const verifyOTPLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'email and otp required' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otpExpiration || Number(user.otpExpiration) < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ message: 'OTP verified successfully', user: userSafe });
  } catch (err) {
    console.error('verifyOTPLogin error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// --- Booking & Vehicle functions (kept but cleaned slightly) ---

const bookRide = async (req, res) => {
  try {
    const { riderId, driverId, source, destination, fare } = req.body;
    const rider = await userModel.findById(riderId);
    const driver = await userModel.findById(driverId);

    if (!rider) return res.status(404).json({ message: 'Rider not found' });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    const newRide = new riderModel({
      riderId,
      driverId,
      source,
      destination,
      fare,
      status: 'pending',
    });

    await newRide.save();
    return res.status(200).json({ message: 'Ride booked successfully', ride: newRide });
  } catch (err) {
    console.error('bookRide error:', err);
    return res.status(500).json({ message: 'Error booking ride', error: err.message });
  }
};

const viewVehicle = async (req, res) => {
  try {
    const details = await vehicleModel.find().populate('userId');
    return res.json(details);
  } catch (err) {
    console.error('viewVehicle error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const booking = async (req, res) => {
  try {
    const { vehicleId, userId, startAddress, endAddress, totalCost, distance, paymentStatus } = req.body;
    const ride = new riderModel({
      vehicleId,
      userId,
      startAddress,
      endAddress,
      fare: totalCost,
      totalDistance: distance,
      status: 'Booked',
      paymentStatus,
    });
    await ride.save();
    return res.json('Confirmed Booking');
  } catch (err) {
    console.error('booking error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Razorpay order + verify (uses env secret)
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount required' });

    const options = {
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, bookingDetails } = req.body;
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment fields' });
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // create ride from bookingDetails if provided
    if (bookingDetails) {
      const ride = new riderModel({
        vehicleId: bookingDetails.vehicleId,
        userId: bookingDetails.userId,
        startAddress: bookingDetails.startAddress,
        endAddress: bookingDetails.endAddress,
        fare: bookingDetails.totalCost,
        totalDistance: bookingDetails.distance,
        status: 'Booked',
        paymentStatus: 'paid',
      });
      await ride.save();
    }

    return res.json({ message: 'Booking confirmed' });
  } catch (err) {
    console.error('verifyPayment error:', err);
    return res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
};

// My bookings (reads header for user id - be consistent on client)
const Mybooking = async (req, res) => {
  try {
    const userid = req.headers._id || req.headers['x-user-id'];
    if (!userid) return res.status(400).json({ message: 'User id header required' });
    const bookings = await riderModel.find({ userId: userid }).populate('vehicleId');
    return res.json(bookings);
  } catch (err) {
    console.error('Mybooking error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { bookid, review, rating } = req.body;
    if (!bookid) return res.status(400).json({ message: 'bookid required' });
    await riderModel.findByIdAndUpdate({ _id: bookid }, { review, rating, reviewstatus: 'pending' });
    return res.json('Review Submitted Successfully');
  } catch (err) {
    console.error('addReview error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { Name, Message, Email } = req.body;
    if (!Name || !Message || !Email) return res.status(400).json({ message: 'All fields are required' });

    const contact = new contactModel({ Name, Message, Email });
    await contact.save();
    return res.json('Message Received Successfully');
  } catch (err) {
    console.error('addMessage error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const profile = async (req, res) => {
  try {
    const userid = req.headers.id || req.headers['x-user-id'];
    if (!userid) return res.status(400).json({ message: 'User id header required' });

    const user = await userModel.findOne({ _id: userid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rides = await riderModel.find({ userId: userid, status: 'Completed' });
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.json({ user: userSafe, rides });
  } catch (err) {
    console.error('profile error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  bookRide,
  viewVehicle,
  booking,
  Mybooking,
  addReview,
  addMessage,
  profile,
  verifyOTPLogin,
  resendOTP,
  createOrder,
  verifyPayment,
};
