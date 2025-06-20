import { FaRegBookmark, FaRegUser, FaChevronDown, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineSpeaker } from "react-icons/md";
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Page imports
import FarmerItemsPage from "../FarmerProducts/farmerItemsPage";
import UpdateItemPage from "../FarmerProducts/updateItemPage";
import AddItemPage from "../FarmerProducts/addItemsPage";
import InquiriesPage from "./inquiriesPage";
import OrdersPage from "./ordersPage";
import ProfilePage from "../ProfilePage";
import EditProfilePage from "../EditProfilePage";

/**
 * FarmerPage - Main dashboard component for farmers
 * Handles authentication and displays the farmer interface
 */
export default function FarmerPage() {
  const [userValidated, setUserValidated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
          setUserData(user);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col p-5 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          🌱 AgriDashboard
        </h1>

        <nav className="flex flex-col space-y-4 flex-1">
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

        {/* Profile Section at Bottom */}
        <div className="mt-auto pt-4 border-t border-green-700">
          <div className="relative profile-dropdown">
            <button
              onClick={toggleProfileDropdown}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <FaRegUser size={16} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">
                  {userData?.firstName && userData?.lastName 
                    ? `${userData.firstName} ${userData.lastName}` 
                    : "Loading..."}
                </div>
                <div className="text-xs text-green-200">
                  {userData?.email || ""}
                </div>
              </div>
              <FaChevronDown 
                size={12} 
                className={`transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  to="/farmer/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <FaRegUser size={16} />
                  <span>View Profile</span>
                </Link>
                <Link
                  to="/farmer/profile/edit"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <FaUserEdit size={16} />
                  <span>Edit Profile</span>
                </Link>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition duration-200"
                >
                  <FaSignOutAlt size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
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
              <Route path="orders" element={<OrdersPage />} />
              <Route path="items" element={<FarmerItemsPage />} />
              <Route path="items/edit" element={<UpdateItemPage />} />
              <Route path="items/add" element={<AddItemPage />} />
              <Route path="inquiries" element={<InquiriesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/edit" element={<EditProfilePage/>} />
            </Routes>
          </div>
        )}
      </main>
    </div>
  );
}