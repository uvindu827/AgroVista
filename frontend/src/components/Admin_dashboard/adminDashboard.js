import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleStaffManagement = () => {
    navigate("/staff");
  };

  const handlenfManagement = () => {
    navigate("/nf-management");
  };

return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-green-50 min-h-screen">
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none mb-4">
            <button
                onClick={handleStaffManagement}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
                Staff Management
            </button>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                onClick={handlenfManagement}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
                Newsfeed Management
            </button>
        </div>
    </div>
);
}

export default AdminDashboard;
