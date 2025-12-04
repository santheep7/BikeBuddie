import { useEffect, useState, useRef } from "react";
import { FaBicycle } from "react-icons/fa";
import UserNav from "./usernav";
import axios from "axios";
import L from "leaflet";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookRide = () => {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paylater");

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routeLayer = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ⛳ Load Riders
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/viewbikes`);
        const data = await response.json();
        const verified = data.filter(
          (item) => item.userId && item.userId.verifieddriver === true
        );
        setRiders(verified);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRiders();
    initLeafletMap();
  }, []);

  // 🌍 Initialize Leaflet Map
  const initLeafletMap = () => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([10.1632, 76.6413], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }
  };

  // 🌎 Geocoding using Nominatim (Free)
  const geocode = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data[0]) throw new Error("Location not found");
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  };

  // 📍 Draw Route + Calculate Distance
  const getDistanceAndRoute = async () => {
    if (!startAddress || !endAddress)
      return alert("Please enter both locations.");

    try {
      const start = await geocode(startAddress);
      const end = await geocode(endAddress);

      // Request route polyline from OSRM
      const osrmURL = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?geometries=geojson&overview=full`;

      const res = await fetch(osrmURL);
      const routeData = await res.json();

      if (!routeData.routes || !routeData.routes[0]) {
        alert("Route not found.");
        return;
      }

      const routeCoords = routeData.routes[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);

      const km = routeData.routes[0].distance / 1000;
      setDistance(km.toFixed(2) + " km");

      // Remove old route if exists
      if (routeLayer.current) {
        mapInstance.current.removeLayer(routeLayer.current);
      }

      // Draw route
      routeLayer.current = L.polyline(routeCoords, {
        color: "blue",
        weight: 5,
      }).addTo(mapInstance.current);

      // Fit map to route
      mapInstance.current.fitBounds(routeLayer.current.getBounds());
    } catch (err) {
      console.log(err);
      alert("Error getting route.");
    }
  };

  const totalPrice = parseFloat(distance) * 8 || 0;

  // 🚗 Booking Handler
  const handleBooking = async () => {
    if (!selectedRider) {
      toast.error("Please select a rider!");
      return;
    }

    const bookingDetails = {
      vehicleId: selectedRider._id,
      userId: localStorage.getItem("id"),
      startAddress,
      endAddress,
      distance,
      totalCost: totalPrice,
      paymentStatus: paymentMethod,
    };

    // If online payment is selected, trigger Razorpay
    if (paymentMethod === "paid") {
      try {
        // Create Razorpay order
        const orderResponse = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
          amount: totalPrice,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });

        const { id: order_id, amount: orderAmount, currency } = orderResponse.data;

        // Razorpay options
        const options = {
          key: "rzp_test_RnTdPMTgqo87pK",
          amount: orderAmount,
          currency: currency,
          name: "Bike Buddie",
          description: "Ride Booking Payment",
          order_id: order_id,
          handler: async function (response) {
            try {
              // Verify payment
              const verifyRes = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: bookingDetails,
              });

              toast.success("Payment successful! Booking confirmed.", {
                position: "top-center",
                autoClose: 3000,
              });
              // Reload after toast
              setTimeout(() => window.location.reload(), 3000);
            } catch (error) {
              console.error("Payment verification failed:", error);
              console.error("Error response:", error.response?.data);
              toast.error(`Payment verification failed! ${error.response?.data?.error || error.message}`, {
                position: "top-center",
                autoClose: 5000,
              });
            }
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#ff7043",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error creating order:", error);
        console.error("Error details:", error.response?.data);
        toast.error(`Failed to initiate payment! ${error.response?.data?.error || error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } else {
      // Pay later - direct booking
      axios
        .post(`${API_BASE_URL}/api/user/bookride`, bookingDetails)
        .then((res) => {
          toast.success(res.data || "Booking confirmed!", {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => window.location.reload(), 3000);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to book ride!", {
            position: "top-center",
            autoClose: 5000,
          });
        });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <UserNav />

      <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
            🚀 Book Your Ride
          </h1>

          <div
            ref={mapRef}
            className="w-full h-[350px] rounded-xl shadow-md mb-6 bg-gray-200"
          ></div>

          {/* Location Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Starting Location"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 w-full"
            />

            <input
              type="text"
              placeholder="Destination Location"
              value={endAddress}
              onChange={(e) => setEndAddress(e.target.value)}
              className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          <button
            onClick={getDistanceAndRoute}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Get Distance & Route
          </button>

          {distance && (
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Distance: {distance}
            </p>
          )}

          <p className="text-lg font-semibold text-gray-700">
            Total Price: ₹{totalPrice.toFixed(2)}
          </p>

          {/* Riders */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800">Select Vehicle</h2>

            <select
              className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setSelectedRider(
                  riders.find((r) => r.vehicleName === e.target.value)
                )
              }
            >
              <option value="">Choose a vehicle</option>
              {riders.map((r, i) => (
                <option key={i} value={r.vehicleName}>
                  {r.vehicleName} ({r.model})
                </option>
              ))}
            </select>

            {selectedRider && (
              <div className="mt-4 p-5 bg-gray-50 border rounded-xl shadow-md flex items-center gap-4">
                <FaBicycle className="text-blue-600 text-4xl" />
                <div>
                  <p className="font-bold text-lg">{selectedRider.vehicleName}</p>
                  <p className="text-gray-500 text-sm">{selectedRider.model}</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Payment Method</h2>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="paylater"
                  checked={paymentMethod === "paylater"}
                  onChange={() => setPaymentMethod("paylater")}
                />
                Pay Later
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="paid"
                  checked={paymentMethod === "paid"}
                  onChange={() => setPaymentMethod("paid")}
                />
                Online Payment
              </label>
            </div>
          </div>

          <button
            onClick={handleBooking}
            className="w-full mt-8 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-md hover:bg-green-700 transition"
          >
            Book Ride
          </button>
        </div>
      </div>
    </>
  );
};

export default BookRide;
