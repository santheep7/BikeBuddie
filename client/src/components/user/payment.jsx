import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer,toast,Bounce } from 'react-toastify';

const Payment = () => {
  const [amount, setAmount] = useState(500);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
        amount: amount,
        currency: "INR",
        receipt: `receipt#${Math.floor(Math.random() * 1000) + 1}`
      });

      const { id: order_id, amount: orderAmount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_AQz9oVZHhqMI1R",  // Replace with your Razorpay Test Key
        amount: orderAmount,
        currency: currency,
        name: "Bike Buddies",
        description: "Bike Ride Payment",
        order_id: order_id,
        handler: async function (response) {
          const verifyRes = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.status === 200) {
            toast.success('Payment succesfull');
            // alert('Payment successful');

          } else {
            // alert('Payment verification failed');
            toast.error('Payment verification Failed..!');
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      // alert('Payment failed');
      toast.error('Payment Failed');
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <h2>Razorpay Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
