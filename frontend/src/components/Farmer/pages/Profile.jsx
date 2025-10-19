import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../pages/context/AuthContext"; // Adjust path if needed

const Profile = () => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assuming you have an endpoint to get user profile
        const res = await axios.get(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Farmer Profile</h2>
      <p><strong>Name:</strong> {profileData.name || user.name}</p>
      <p><strong>Email:</strong> {profileData.email || user.email}</p>
      <p><strong>Phone:</strong> {profileData.phone || "Not provided"}</p>
      <p><strong>Address:</strong> {profileData.address || "Not provided"}</p>
      {/* Add more fields as you have in your user schema */}
    </div>
  );
};

export default Profile;
