import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import gsap from "gsap";

export default function ViewRides() {
  const [stats, setStats] = useState({
    total: 0,
    booked: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // GSAP refs
  const titleRef = useRef(null);
  const barRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/viewrides`)
      .then((res) => {
        calculateStats(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      booked: data.filter((ride) => ride.status === "Booked").length,
      confirmed: data.filter((ride) => ride.status === "Confirmed").length,
      completed: data.filter((ride) => ride.status === "Completed").length,
      cancelled: data.filter((ride) => ride.status === "Cancelled").length,
    });
  };

  // Bar data
  const barData = [
    { name: "Booked", value: stats.booked },
    { name: "Confirmed", value: stats.confirmed },
    { name: "Completed", value: stats.completed },
    { name: "Cancelled", value: stats.cancelled },
  ];

  // Pie data
  const pieData = barData.map((item) => ({ name: item.name, value: item.value }));

  const COLORS = ["#FF9800", "#4CAF50", "#9C27B0", "#D32F2F"];

  // GSAP ANIMATIONS
  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );

    gsap.fromTo(
      barRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.2 }
    );

    gsap.fromTo(
      pieRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.3 }
    );
  }, [stats]);

  return (
    <div className="p-6">
      {/* Title */}
      <h1
        ref={titleRef}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        Rides Statistical Report
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div
          ref={barRef}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
            Ride Status Overview
          </h2>

          <div className="flex justify-center">
            <BarChart width={400} height={300} data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2196F3" />
            </BarChart>
          </div>
        </div>

        {/* Pie Chart */}
        <div
          ref={pieRef}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
            Ride Status Distribution
          </h2>

          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}
