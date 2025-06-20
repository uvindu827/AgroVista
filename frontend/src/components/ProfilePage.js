import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

/**
 * ProfilePage - Component to display user profile information
 */
export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
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

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/farmer/orders"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
        <Link
          to="/farmer/profile/edit"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          <FaEdit size={16} />
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaUser size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {userData?.firstName && userData?.lastName 
                  ? `${userData.firstName} ${userData.lastName}` 
                  : "N/A"}
              </h2>
              <p className="text-green-100 capitalize">{userData?.role || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h3>
              
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <div className="font-medium text-gray-800">
                    {userData?.firstName || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <div className="font-medium text-gray-800">
                    {userData?.lastName || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <div className="font-medium text-gray-800">
                    {userData?.email || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <div className="font-medium text-gray-800">
                    {userData?.phone || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <div className="font-medium text-gray-800">
                    {userData?.address || "Not provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Account Information
              </h3>
              
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <div className="font-medium text-gray-800 capitalize">
                    {userData?.role || "Not specified"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Account Status</label>
                  <div className={`font-medium ${userData?.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                    {userData?.isBlocked ? "Blocked" : "Active"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" size={16} />
                <div>
                  <label className="text-sm text-gray-500">Email Verified</label>
                  <div className={`font-medium ${userData?.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {userData?.emailVerified ? "Yes" : "Pending"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500">Member Since</label>
                <div className="font-medium text-gray-800">
                  {userData?.createdAt 
                    ? new Date(userData.createdAt).toLocaleDateString() 
                    : "N/A"}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Account Status</label>
                <div className={`font-medium ${userData?.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                  {userData?.isBlocked ? "Blocked" : "Active"}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email Verified</label>
                <div className={`font-medium ${userData?.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {userData?.emailVerified ? "Yes" : "Pending"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}