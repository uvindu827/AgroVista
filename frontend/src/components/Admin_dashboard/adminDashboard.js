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

  const handleNewsFeed = () => {
    navigate("/newsfeed");
  };
  
  const handleUsersManagement = () => {
    navigate("/users_management");
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
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none mb-4">
            <button
                onClick={handlenfManagement}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                Newsfeed Management
            </button>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none mb-4">
            <button
                onClick={handleNewsFeed}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                User Newsfeed
            </button>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none mb-4">
            <button
                onClick={handleUsersManagement}
                className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
                User Management
            </button>
        </div>
    </div>
);
}

export default AdminDashboard;
