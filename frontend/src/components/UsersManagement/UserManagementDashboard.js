import React, { useState } from "react";
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if(!window.confirm('Are you sure you want to delete this user?'))
      return;
    console.log(userId);
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-8">
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
        {/* Role Selection Buttons */}
        <button
          onClick={() => fetchUsers("farmer")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors"
        >
          Farmer Management
        </button>
        <button
          onClick={() => fetchUsers("buyer")}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors"
        >
          Buyer Management
        </button>
        <button
          onClick={() => fetchUsers("customer")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
        >
          Customer Management
        </button>
        <button
          onClick={() => fetchUsers("tool dealer")}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md shadow-sm transition-colors"
        >
          Tool Dealer Management
        </button>
        <button
          onClick={() => fetchUsers("agricultural inspector")}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-sm transition-colors"
        >
          Agricultural Inspector Management
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center p-8 text-gray-600">Loading users...</div>
      )}
      {error && (
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      )}

      {/* Users Display */}
      {users.length > 0 && !loading && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {selectedRole} Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
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
                      className="text-red-500 hover:text-red-900"
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

      {/* Empty State */}
      {users.length === 0 && !loading && !error && selectedRole && (
        <div className="text-center p-8 text-gray-600">
          No users found for {selectedRole} role
        </div>
      )}
    </div>
  );
}

export default UserManagementDashboard;
