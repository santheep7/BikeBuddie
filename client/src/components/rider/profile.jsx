import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "./navbar";
import gsap from "gsap";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // GSAP Refs
  const profileRef = useRef(null);
  const rideCardsRef = useRef([]);

  useEffect(() => {
    const userid = localStorage.getItem("id");

    axios
      .get(`${API_BASE_URL}/user/profile`, { headers: { id: userid } })
      .then((res) => {
        setUser(res.data.user);
        setRides(res.data.rides);
      })
      .catch((err) => console.log(err));
  }, []);

  // GSAP Animations
  useEffect(() => {
  // Profile Card animation (fromTo)
  gsap.fromTo(
    profileRef.current,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    }
  );

  // Ride Cards animation with stagger
  gsap.fromTo(
    rideCardsRef.current,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
      delay: 0.2,
    }
  );
}, [user, rides]);


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Profile
        </h1>

        {/* USER PROFILE CARD */}
        {user && (
          <div
            ref={profileRef}
            className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto mb-10 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              User Information
            </h2>

            <p className="text-gray-600 mb-2">
              <strong className="text-gray-800">Full Name:</strong> {user.fullname}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-gray-800">Email:</strong> {user.email}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-gray-800">Status:</strong>{" "}
              {user.verifieddriver ? "Verified" : "Not Verified"}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Role:</strong> {user.role}
            </p>
          </div>
        )}

        {/* RIDE HISTORY */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Your Ride History
        </h2>

        {rides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride, index) => (
              <div
                key={index}
                ref={(el) => (rideCardsRef.current[index] = el)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Ride #{index + 1}
                </h3>

                <p className="text-gray-600 mb-1">
                  <strong className="text-gray-700">Vehicle:</strong>{" "}
                  {ride?.vehicleId?.regNo || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong className="text-gray-700">Start:</strong>{" "}
                  {ride.startAddress}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong className="text-gray-700">End:</strong>{" "}
                  {ride.endAddress}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong className="text-gray-700">Distance:</strong>{" "}
                  {ride.totalDistance}
                </p>
                <p className="text-gray-700 font-medium mb-1">
                  <strong>Fare:</strong> ₹{ride.fare}
                </p>
                <p className="text-yellow-600 font-medium">
                  ⭐ Rating: {ride.rating}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-600 text-xl">
            No completed rides found.
          </div>
        )}
      </div>
    </div>
  );
}
