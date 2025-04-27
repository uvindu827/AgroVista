import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "../Admin_dashboard/adminDashboard";
import { FaBars, FaTimes } from "react-icons/fa";

function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("farmer"); // Set default role to farmer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <header className="w-full bg-darkGreen/90 backdrop-blur-md text-white flex items-center justify-between px-8 py-3 shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img
            src="/agrologo.png"
            alt="AgroVista Logo"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-wide">
              AgroVista
            </span>
            <span className="text-xs font-light text-gray-200 hidden sm:block">
              Admin Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Future: Add user avatar or logout button here if needed */}
        </div>
      </header>

      <div className="flex flex-1 mt-1 mb-1">
        {sidebarOpen && (
          <div className="w-64 bg-[rgba(79,121,66,0.8)] min-h-[90vh] my-4 p-4 shadow-md rounded-lg border border-green-200">
            <AdminDashboard />
          </div>
        )}

        <div className="flex-1 p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 px-4 py-2 bg-darkGreen hover:bg-fernGreen text-white rounded shadow transition-colors flex items-center justify-center"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

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
