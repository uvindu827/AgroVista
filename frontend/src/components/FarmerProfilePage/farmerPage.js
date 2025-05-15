import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { MdOutlineSpeaker } from "react-icons/md";
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Page imports
import FarmerItemsPage from "../FarmerProducts/farmerItemsPage";
import UpdateItemPage from "../FarmerProducts/updateItemPage";
import AddItemPage from "../FarmerProducts/addItemsPage";

/**
 * FarmerPage - Main dashboard component for farmers
 * Handles authentication and displays the farmer interface
 */
export default function FarmerPage() {
  const [userValidated, setUserValidated] = useState(false);

  // Authentication check on component mount
  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }
      
      try {
        const response = await axios.get("http://localhost:3000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const user = response.data;
        if (user.role === "farmer") {
          setUserValidated(true);
        } else {
          window.location.href = "/farmer/";
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setUserValidated(false);
      }
    };

    validateUser();
  }, []);

  // Navigation link component for sidebar
  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      className="flex items-center gap-2 text-lg font-medium p-3 rounded-lg hover:bg-green-700 transition duration-300"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col p-5 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          🌱 AgriDashboard
        </h1>
        
        <nav className="flex flex-col space-y-4">
          <NavLink 
            to="/farmer/orders" 
            icon={<FaRegBookmark size={20} />} 
            label="Orders" 
          />
          <NavLink 
            to="/farmer/items" 
            icon={<MdOutlineSpeaker size={20} />} 
            label="Items" 
          />
          <NavLink 
            to="/farmer/inquiries" 
            icon={<FaRegUser size={20} />} 
            label="Inquiries" 
          />
          <NavLink 
            to="/newsfeed" 
            icon={<FaRegUser size={20} />} 
            label="NewsFeed" 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        {/* Rent Tools Button */}
        <div className="absolute top-6 right-6">
          <Link
            to="/farmer/rent-tools"
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
          >
            Rent Tools
          </Link>
        </div>

        {/* Routes - Only shown when user is validated */}
        {userValidated && (
          <div className="mt-6">
            <Routes>
              <Route path="/items" element={<FarmerItemsPage />} />
              <Route path="/items/edit" element={<UpdateItemPage />} />
              <Route path="/items/add" element={<AddItemPage />} />
            </Routes>
          </div>
        )}
      </main>
    </div>
  );
}