import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiShoppingCart,
  FiPlusCircle,
  FiLogOut,
  FiAlertCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";

export default function Sidebar() {
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

  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-2 px-4 py-2 rounded hover:bg-green-600 hover:text-white ${
      isActive ? "bg-green-600 text-white" : "text-gray-800"
    }`;

  return (
    <div
      className="w-64 min-h-screen flex flex-col shadow-xl"
      style={{
        background: 'linear-gradient(135deg, #38b2ac 0%, #22c55e 100%)',
        backdropFilter: 'blur(12px)',
        borderRadius: '32px',
        boxShadow: '0 8px 32px rgba(34,197,94,0.18)',
        border: '2px solid rgba(56,178,172,0.18)',
        margin: '18px 0 18px 18px',
        fontFamily: 'Poppins, Segoe UI, sans-serif',
        position: 'relative',
      }}
    >
      <h2
        className="text-3xl font-extrabold text-center py-6"
        style={{
          color: '#fff',
          letterSpacing: '2px',
          textShadow: '0 2px 12px #22c55e',
        }}
      >
        Inspector Dashboard
      </h2>

      <nav className="space-y-2 px-4 mt-2">
        <NavLink to="/instructor" className={linkClasses} style={{ transition: 'all 0.2s' }}>
          <FiHome className="transition-transform duration-200 group-hover:scale-125" size={22} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Home</span>
        </NavLink>
        <NavLink to="/instructor/courses" className={linkClasses} style={{ transition: 'all 0.2s' }}>
          <FiBookOpen className="transition-transform duration-200 group-hover:scale-125" size={22} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Courses</span>
        </NavLink>
        <NavLink to="/instructor/purchases" className={linkClasses} style={{ transition: 'all 0.2s' }}>
          <FiShoppingCart className="transition-transform duration-200 group-hover:scale-125" size={22} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Course Purchases</span>
        </NavLink>
        <NavLink to="/instructor/add-course" className={linkClasses} style={{ transition: 'all 0.2s' }}>
          <FiPlusCircle className="transition-transform duration-200 group-hover:scale-125" size={22} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Add Course</span>
        </NavLink>
        <NavLink to="/crop-disease-detection" className={linkClasses} style={{ transition: 'all 0.2s' }}>
          <FiAlertCircle className="transition-transform duration-200 group-hover:scale-125" size={22} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Crop Disease Detection</span>
        </NavLink>
      </nav>

      <div className="px-4 mt-8 mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-red-400 to-red-600 shadow hover:scale-105 transition w-full"
          style={{ letterSpacing: '1px', fontSize: '1.08rem' }}
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
