import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaRobot,
  FaCartArrowDown,
  FaCheckCircle,
} from 'react-icons/fa';
import Swal from "sweetalert2";

export default function FarmerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("loggedIn");
        sessionStorage.clear();
        navigate("/");
        Swal.fire("Logged Out", "You have been successfully logged out.", "success");
      }
    });
  };

  return (
    <div className="w-60 min-h-screen bg-green-100 p-4 flex flex-col space-y-4 shadow-lg">
      <Link
        to="/farmer/home"
        className="flex items-center space-x-2 hover:bg-green-300 p-2 rounded text-black font-bold"
      >
        <FaHome /> <span>Home</span>
      </Link>

      <Link
        to="/farmer/paid-courses"
        className="flex items-center space-x-2 hover:bg-green-300 p-2 rounded text-black font-bold"
      >
        <FaCheckCircle /> <span>Paid Courses</span>
      </Link>

      <Link
        to="/farmer/buy-courses"
        className="flex items-center space-x-2 hover:bg-green-300 p-2 rounded text-black font-bold"
      >
        <FaShoppingCart /> <span>Buy Courses</span>
      </Link>

      <Link
        to="/farmer/cart"
        className="flex items-center space-x-2 hover:bg-green-300 p-2 rounded text-black font-bold"
      >
        <FaCartArrowDown /> <span>Cart</span>
      </Link>

      <Link
        to="/farmer/assistant"
        className="flex items-center space-x-2 hover:bg-green-300 p-2 rounded text-black font-bold"
      >
        <FaRobot /> <span>AI Assistant</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 hover:bg-red-300 p-2 rounded text-black font-bold"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </div>
  );
}
