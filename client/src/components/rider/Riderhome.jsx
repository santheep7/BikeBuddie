import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import axios from 'axios';

export default function Riderhome() {
  const [record, setRecord] = useState({});
  const userId = localStorage.getItem('id');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API_BASE_URL}/rider/viewtravel`, { headers: { id: userId } })
      .then((res) => {
        setRecord(res.data);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  // Safe parsing for totalKilometers
  let totalKilometers = 0;
  if (record.totalKilometers && typeof record.totalKilometers === "string") {
    const kilometersString = record.totalKilometers.replace("km", "").trim();
    const numbersArray = kilometersString
      .split(" ")
      .map((num) => parseFloat(num))
      .filter((num) => !isNaN(num));
    totalKilometers = numbersArray.reduce((acc, current) => acc + current, 0);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <h1 className="text-3xl font-semibold text-center text-gray-700">
          Welcome back, Rider! 👋
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">

          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Rides</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {record.totalRidesCount || 0}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{record.totalEarnings || 0}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">Kilometers Ridden</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {totalKilometers} km
            </p>
          </div>

        </div>

        {/* Latest Updates */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Latest Updates
          </h2>

          <div className="bg-white shadow-md rounded-lg p-5 mb-4">
            <h3 className="text-xl font-medium text-gray-700">New Rider Tips</h3>
            <p className="text-gray-600 mt-1">
              Check out our latest blog post for tips to maximize your earnings!
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-5 mb-4">
            <h3 className="text-xl font-medium text-gray-700">Featured Destinations</h3>
            <p className="text-gray-600 mt-1">
              Discover new and exciting places to ride to this weekend!
            </p>
          </div>
        </div>

        {/* Policies */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Riding Policies
          </h2>

          <div className="space-y-4">
            {[
              {
                title: "1. Safe Driving",
                desc: "Always wear a helmet and keep your vehicle in good condition before starting the ride."
              },
              {
                title: "2. Respect Traffic Laws",
                desc: "Follow all traffic rules and avoid speeding. Always use signals when turning."
              },
              {
                title: "3. Customer Courtesy",
                desc: "Greet the customer politely and ensure your vehicle is clean and comfortable."
              },
              {
                title: "4. Alcohol & Drugs",
                desc: "Riding under the influence is strictly prohibited and violates company policies."
              },
              {
                title: "5. Punctuality",
                desc: "Reach on time for all rides. If late, inform the customer immediately."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-5">
                <h3 className="text-xl font-medium text-gray-700">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
