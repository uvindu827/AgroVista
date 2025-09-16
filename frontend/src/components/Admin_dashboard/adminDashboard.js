// AdminDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Newspaper, UserCircle2, LayoutGrid } from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleStaffManagement = () => {
    navigate("/staff");
  };

  const handleNfManagement = () => {
    navigate("/nf-management");
  };

  const handleInquiryManagement = () => {
    navigate("/inquiries");
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Admin Menu</h2>

      <button
        onClick={handleStaffManagement}
        className="w-full flex items-center gap-2 bg-transparent border-2 border-transparent hover:border-white text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
      >
        <Users className="w-5 h-5" /> Staff Management
      </button>

      <button
        onClick={handleNfManagement}
        className="w-full flex items-center gap-2 bg-transparent border-2 border-transparent hover:border-white text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
      >
        <Newspaper className="w-5 h-5" /> Newsfeed Management
      </button>

      <button
        onClick={handleInquiryManagement}
        className="w-full flex items-center gap-2 bg-transparent border-2 border-transparent hover:border-white text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300"
      >
        <UserCircle2 className="w-5 h-5" /> Inquiries Management
      </button>
    </div>
  );
}

export default AdminDashboard;
