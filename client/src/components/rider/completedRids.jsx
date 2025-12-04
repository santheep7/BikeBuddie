import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from './navbar';

export default function CompletedRides() {
  const [booking, setBooking] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const userid = localStorage.getItem("id");
    axios
      .get(`${API_BASE_URL}/api/rider/viewrides`, { headers: { _id: userid } })
      .then((res) => {
        console.log(res.data);
        setBooking(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const bookings = booking.filter((ride) => ride.status == "Completed");

 


  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="heading">My Ride Bookings</h2>

        {bookings.length > 0 ? (
          <div className="card-container">
            {bookings.map((ride, index) => (
              <div key={index} className="card">
                {/* Booking Header */}
                <div className="card-header">Booking #{index + 1}</div>

                {/* Ride Details */}
                <div className="ride-details">
                  <p className="details">🆔 Booking ID: <span className="id">{ride._id}</span></p>
                  <p className="details">📍 Start: <span className="highlight">{ride.startAddress}</span></p>
                  <p className="details">🚩 End: <span className="highlight">{ride.endAddress}</span></p>
                  <p className="details">🚗 Distance: <span className="highlight">{ride.totalDistance} km</span></p>
                  <p className="details">💵 Amount: <span className="highlight">₹{ride.fare}</span></p>

                  {/* Status Indicator */}
                  <div className="status-indicator">
                    🚦 Status:{" "}
                    <span className={`status ${ride.status.toLowerCase()}`}>{ride.status}</span>
                  </div>

                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-bookings">No bookings found</p>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .heading {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }

        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background-color: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #d1d5db;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }

        .card-header {
          background-color: #3b82f6;
          color: white;
          padding: 12px;
          border-radius: 12px 12px 0 0;
          text-align: center;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .ride-details {
          padding: 1rem;
        }

        .details {
          font-size: 1.125rem;
          font-weight: 600;
          color: #4b5563;
        }

        .highlight {
          color: #3b82f6;
        }

        .id {
          font-weight: normal;
          color: #333;
        }

        .status-indicator {
          margin-top: 1rem;
          text-align: center;
        }

        .status {
          padding: 6px 12px;
          border-radius: 9999px;
          color: white;
        }

        .status.accepted {
          background-color: #10b981;
        }

        .status.started {
          background-color: #f59e0b;
        }

        .status.completed {
          background-color: #10b981;
        }

        .status.pending {
          background-color: #facc15;
        }

        .status.cancelled {
          background-color: #ef4444;
        }

        .button-container {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
        }

        .button {
          padding: 8px 16px;
          border-radius: 8px;
          color: white;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .accept {
          background-color: #10b981;
        }

        .start {
          background-color: #f59e0b;
        }

        .complete {
          background-color: #22c55e;
        }

        .cancel {
          background-color: #ef4444;
        }

        .button:hover {
          opacity: 0.9;
        }

        .accept:hover {
          background-color: #059669;
        }

        .start:hover {
          background-color: #d97706;
        }

        .complete:hover {
          background-color: #16a34a;
        }

        .cancel:hover {
          background-color: #dc2626;
        }

        .no-bookings {
          text-align: center;
          font-size: 1.125rem;
          color: #4b5563;
        }
      `}</style>
    </>
  );
}
