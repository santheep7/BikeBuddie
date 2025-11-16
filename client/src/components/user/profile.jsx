import React, { useEffect, useState } from "react";
import axios from "axios";
import Userhome from "./usernav";
import confetti from "canvas-confetti";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const userid = localStorage.getItem("id");

    axios
      .get(`${API_BASE_URL}/user/profile`, { headers: { id: userid } })
      .then((res) => {
        setUser(res.data.user);
        setRides(res.data.rides);

        // 🎉 Trigger confetti if user is verified
        if (res.data.user?.verified) {
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 70,
              origin: { y: 0.6 },
            });
          }, 500);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Userhome />

      <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            🧑‍💼 User Profile
          </h1>

          {/* User Information */}
          {user && (
            <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                User Information
              </h2>

              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-bold">Full Name:</span> {user.fullname}
                </p>
                <p>
                  <span className="font-bold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-bold">Status:</span>{" "}
                  {user.verified ? (
                    <span className="text-green-600 font-bold">Verified ✔</span>
                  ) : (
                    <span className="text-red-500 font-bold">Not Verified</span>
                  )}
                </p>
                <p>
                  <span className="font-bold">Role:</span> {user.role}
                </p>
              </div>
            </div>
          )}

          {/* Ride History */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🚲 Ride History
          </h2>

          {rides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rides.map((ride, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md hover:shadow-xl transition rounded-xl p-5"
                >
                  <h3 className="text-lg font-bold mb-2 text-blue-600">
                    Ride #{index + 1}
                  </h3>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p>
                      <span className="font-semibold">Vehicle No:</span>{" "}
                      {ride.vehicleId?.regNo || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Start:</span>{" "}
                      {ride.startAddress}
                    </p>
                    <p>
                      <span className="font-semibold">End:</span>{" "}
                      {ride.endAddress}
                    </p>
                    <p>
                      <span className="font-semibold">Distance:</span>{" "}
                      {ride.totalDistance}
                    </p>
                    <p>
                      <span className="font-semibold">Fare:</span> ₹{ride.fare}
                    </p>
                    <p>
                      <span className="font-semibold">Rating:</span>{" "}
                      {ride.rating || "Not Rated"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-xl p-6 text-center text-gray-600">
              No completed rides found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
