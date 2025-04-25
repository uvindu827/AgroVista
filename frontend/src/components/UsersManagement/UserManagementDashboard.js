import React from "react";
import { useNavigate } from "react-router-dom";

function UserManagementDashboard() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/users/${role}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-green-50 min-h-screen">
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handleRoleSelect("farmer")}
          className="w-fit inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Farmer Management
        </button>

        <button
          onClick={() => handleRoleSelect("buyer")}
          className="w-fit inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Buyer Management
        </button>

        <button
          onClick={() => handleRoleSelect("customer")}
          className="w-fit inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Customer Management
        </button>

        <button
          onClick={() => handleRoleSelect("tool dealer")}
          className="w-fit inline-flex items-center justify-center rounded-md bg-yellow-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Tool Dealer Management
        </button>

        <button
          onClick={() => handleRoleSelect("agricultural inspector")}
          className="w-fit inline-flex items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Agricultural Inspector Management
        </button>
      </div>
    </div>
  );
}

export default UserManagementDashboard;