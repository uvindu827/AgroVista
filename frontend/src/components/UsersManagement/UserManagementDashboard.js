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
      <header className="w-full bg-darkGreen text-white flex items-center justify-between px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold">AgroVista</span>
          <span className="text-sm font-light hidden sm:block">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <img
            src="/agrologo.png"
            alt="agrologo"
            className="w-20 h-20 rounded-full border-2 border-white"
          />
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && (
          <div className="w-64 bg-fernGreen min-h-screen shadow-md">
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

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => fetchUsers("farmer")}
                className="px-6 py-3 bg-darkGreen hover:bg-fernGreen text-white rounded-md shadow-sm transition-colors"
              >
                Farmer Management
              </button>
              <button
                onClick={() => fetchUsers("buyer")}
                className="px-6 py-3 bg-sinopia hover:bg-sienna text-white rounded-md shadow-sm transition-colors"
              >
                Buyer Management
              </button>
              <button
                onClick={() => fetchUsers("customer")}
                className="px-6 py-3 bg-gamboge hover:bg-sienna text-white rounded-md shadow-sm transition-colors"
              >
                Customer Management
              </button>
              <button
                onClick={() => fetchUsers("tool dealer")}
                className="px-6 py-3 bg-fernGreen hover:bg-darkGreen text-white rounded-md shadow-sm transition-colors"
              >
                Tool Dealer Management
              </button>
              <button
                onClick={() => fetchUsers("agricultural inspector")}
                className="px-6 py-3 bg-sienna hover:bg-darkGreen text-white rounded-md shadow-sm transition-colors"
              >
                Agricultural Inspector Management
              </button>
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
