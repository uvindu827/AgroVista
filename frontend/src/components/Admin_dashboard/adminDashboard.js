import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleStaffManagement = () => {
    navigate("/staff");
  };

  const handleNfManagement = () => {
    navigate("/nf-management");
  };

  const handleNewsFeed = () => {
    navigate("/newsfeed");
  };

  const handleUsersManagement = () => {
    navigate("/users_management");
  };

  return (
    <nav className="p-4">
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleStaffManagement}
          className="w-60 bg-darkGreen hover:bg-fernGreen text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
        >
          Staff Management
        </button>
        <button
          onClick={handleNfManagement}
          className="w-60 bg-sinopia hover:bg-sienna text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
        >
          Newsfeed Management
        </button>
        <button
          onClick={handleNewsFeed}
          className="w-60 bg-gamboge hover:bg-sienna text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
        >
          User Newsfeed
        </button>
        <button
          onClick={handleUsersManagement}
          className="w-60 bg-sienna hover:bg-darkGreen text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
        >
          User Management
        </button>
      </div>
    </nav>
  );
}

export default AdminDashboard;
