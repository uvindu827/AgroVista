import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiShoppingCart,
  FiPlusCircle,
  FiLogOut,
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
    <div className="w-64 bg-green-100 shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold text-center py-4 text-green-700">
        Instructor Dashboard
      </h2>

      <nav className="space-y-1 px-2">
        <NavLink to="/instructor" className={linkClasses}>
          <FiHome />
          <span><h1>Home</h1></span>
        </NavLink>
        <NavLink to="/instructor/courses" className={linkClasses}>
          <FiBookOpen />
          <span><h1>Courses</h1></span>
        </NavLink>
        <NavLink to="/instructor/purchases" className={linkClasses}>
          <FiShoppingCart />
          <span>Course Purchases</span>
        </NavLink>
        <NavLink to="/instructor/add-course" className={linkClasses}>
          <FiPlusCircle />
          <span>Add Course</span>
        </NavLink>
      </nav>

      {/* 👇 Logout button moved up here directly below nav */}
      <div className="px-2 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded text-red-700 hover:bg-red-100 w-full"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
