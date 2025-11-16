import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Navbar from "./navbar";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";

export default function RiderViewBookings() {
  const [booking, setBooking] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routingInstance = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const userid = localStorage.getItem("id");
    axios
      .get(`${API_BASE_URL}/rider/viewrides`, { headers: { _id: userid } })
      .then((res) => setBooking(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleJourneyStart = (ride) => {
    setSelectedRide(ride);
    setShowMap(true);

    setTimeout(
      () => initializeLeaflet(ride.startAddress, ride.endAddress),
      300
    );
  };

  const initializeLeaflet = async (startAddress, endAddress) => {
    if (!mapRef.current) return;

    if (mapInstance.current) mapInstance.current.remove();

    mapInstance.current = L.map(mapRef.current).setView([10.1632, 76.6413], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapInstance.current);

    const getCoords = async (address) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (data.length === 0) throw new Error("Location not found");
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    };

    try {
      const start = await getCoords(startAddress);
      const end = await getCoords(endAddress);

      if (routingInstance.current) routingInstance.current.remove();

      routingInstance.current = L.Routing.control({
        waypoints: [L.latLng(...start), L.latLng(...end)],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      }).addTo(mapInstance.current);
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  const handleAction = (id, action) => {
    axios
      .put(`${API_BASE_URL}/rider/updateStatus`, { status: action, id })
      .then(() => {
        setBooking((prev) =>
          prev.map((ride) =>
            ride._id === id ? { ...ride, status: action } : ride
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const bookings = booking.filter(
    (ride) => ride.status !== "Completed" && ride.status !== "Cancelled"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Ride Bookings
        </h2>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((ride, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-5 border border-gray-200"
              >
                <div className="text-lg font-semibold text-blue-600 mb-3">
                  Booking #{index + 1}
                </div>

                <div className="space-y-2 text-gray-700">
                  <p>
                    🆔 <span className="font-semibold">{ride._id}</span>
                  </p>
                  <p>
                    📍 Start:{" "}
                    <span className="font-semibold text-gray-900">
                      {ride.startAddress}
                    </span>
                  </p>
                  <p>
                    🚩 End:{" "}
                    <span className="font-semibold text-gray-900">
                      {ride.endAddress}
                    </span>
                  </p>
                  <p>
                    🚗 Distance:{" "}
                    <span className="font-semibold text-gray-900">
                      {ride.totalDistance}
                    </span>
                  </p>
                  <p>
                    💵 Amount:{" "}
                    <span className="font-semibold text-green-600">
                      ₹{ride.fare}
                    </span>
                  </p>

                  <p>
                    🚦 Status:{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ride.status === "Pending"
                          ? "bg-yellow-200 text-yellow-700"
                          : ride.status === "Accepted"
                          ? "bg-blue-200 text-blue-700"
                          : ride.status === "Started"
                          ? "bg-purple-200 text-purple-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  {ride.status === "Accepted" ? (
                    <>
                      <button
                        onClick={() => {
                          handleAction(ride._id, "Started");
                          handleJourneyStart(ride);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Journey Start
                      </button>
                      <button
                        onClick={() => handleAction(ride._id, "Cancelled")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  ) : ride.status === "Started" ? (
                    <button
                      onClick={() => handleAction(ride._id, "Completed")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Completed
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAction(ride._id, "Accepted")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(ride._id, "Cancelled")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">No bookings found</p>
        )}
      </div>

      {/* MAP MODAL */}
      {showMap && selectedRide && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-999">
          <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Route from {selectedRide.startAddress} to{" "}
              {selectedRide.endAddress}
            </h3>

            <div ref={mapRef} className="w-full h-96 rounded-lg"></div>

            <button
              onClick={() => setShowMap(false)}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
