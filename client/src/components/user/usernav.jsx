import React from 'react';
import { Link } from 'react-router-dom';

export default function Userhome() {
  const logout = () => {
    localStorage.clear();
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <ul className="flex justify-center gap-10 text-gray-700 font-medium">
        
        <li>
          <Link 
            to="/user/bookride" 
            className="hover:text-blue-600 transition"
          >
            Book Ride
          </Link>
        </li>

        <li>
          <Link 
            to="/user/history" 
            className="hover:text-blue-600 transition"
          >
            MyBookings
          </Link>
        </li>

        <li>
          <Link 
            to="/user/profile" 
            className="hover:text-blue-600 transition"
          >
            Profile
          </Link>
        </li>

        <li>
          <Link 
            to="/" 
            onClick={logout}
            className="hover:text-red-600 transition"
          >
            Logout
          </Link>
        </li>

      </ul>
    </nav>
  );
}
