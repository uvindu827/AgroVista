import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "../Admin_dashboard/adminDashboard";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// Remove Next.js router import
// Using window.location for navigation instead

function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("farmer"); // Set default role to farmer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUsers("farmer");
  }, []);

  const fetchUsers = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/getUsersByRole/${role}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setSelectedRole(role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDeletePost = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/delete/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete user");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Logout function - updated to use window.location
  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to login page using window.location instead of router
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Modern Header */}
      <header className="w-full bg-gradient-to-r from-darkGreen to-fernGreen text-white flex items-center justify-between px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-white/20 transition-all"
          >
            {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="/agrologo.png"
                alt="AgroVista Logo"
                className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wide flex items-center">
                AgroVista
                <span className="ml-2 text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">Admin</span>
              </span>
              <span className="text-xs font-light text-gray-100">
                User Management Dashboard
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1">
            <span className="bg-white/10 rounded-lg px-3 py-1 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-all text-sm"
          >
            <FaSignOutAlt size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/20 transition-all"
            >
              <FaUserCircle size={20} />
              <span className="hidden md:block text-sm font-medium">Admin</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <FaUserCircle className="mr-2" size={14} />
                  Profile
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 mt-1 mb-1">
        {/* Sidebar with proper styling */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} bg-[rgba(79,121,66,0.8)] min-h-[90vh] my-4 p-6 shadow-md rounded-lg border border-green-200`}>
          <AdminDashboard />
        </aside>

        <div className="flex-1 p-4">
          {/* Content area */}
          <div className="p-4 max-w-7xl mx-auto">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            <div className="bg-[rgba(79,121,66,0.1)] p-6 rounded-lg shadow-md border border-green-200 mb-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => fetchUsers("farmer")}
                  className="flex-1 min-w-[150px] px-4 py-2 bg-darkGreen hover:bg-fernGreen text-white rounded-md shadow-sm transition-colors text-sm md:text-base"
                >
                  Farmers
                </button>
                <button
                  onClick={() => fetchUsers("buyer")}
                  className="flex-1 min-w-[150px] px-4 py-2 bg-sinopia hover:bg-sienna text-white rounded-md shadow-sm transition-colors text-sm md:text-base"
                >
                  Buyers
                </button>
                <button
                  onClick={() => fetchUsers("customer")}
                  className="flex-1 min-w-[150px] px-4 py-2 bg-gamboge hover:bg-sienna text-white rounded-md shadow-sm transition-colors text-sm md:text-base"
                >
                  Customers
                </button>
                <button
                  onClick={() => fetchUsers("tool dealer")}
                  className="flex-1 min-w-[150px] px-4 py-2 bg-fernGreen hover:bg-darkGreen text-white rounded-md shadow-sm transition-colors text-sm md:text-base"
                >
                  Tool Dealers
                </button>
                <button
                  onClick={() => fetchUsers("agricultural inspector")}
                  className="flex-1 min-w-[150px] px-4 py-2 bg-sienna hover:bg-darkGreen text-white rounded-md shadow-sm transition-colors text-sm md:text-base"
                >
                  Agricultural Inspectors
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center p-8 text-gray-600 animate-pulse">
              Loading users...
            </div>
          )}
          {error && (
            <div className="text-center p-8 text-red-500">Error: {error}</div>
          )}

          {users.length > 0 && !loading && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-darkGreen capitalize text-center mb-6">
                {selectedRole} Users
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-yellow-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-darkGreen"
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.name}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-block w-20">Role:</span>
                        <span className="capitalize">{user.role}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-block w-20">Status:</span>
                        <span className="text-green-600 font-medium">
                          {user.status || "Active"}
                        </span>
                      </div>
                      <div className="flex justify-end mt-4 space-x-4">
                        <button
                          onClick={() => onDeletePost(user._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {users.length === 0 && !loading && !error && selectedRole && (
            <div className="text-center p-8 text-gray-600">
              No users found for {selectedRole} role
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagementDashboard;