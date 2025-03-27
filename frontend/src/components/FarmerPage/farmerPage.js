import { BsGraphDown } from "react-icons/bs";
import { FaRegBookmark, FaRegUser} from "react-icons/fa";
import { MdOutlineSpeaker } from "react-icons/md";
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import FarmerItemsPage from "../FarmerItemsPage/farmerItemsPage";

import UpdateItemPage from "../FarmerUpdateItempage/updateItemPage";
import AddItemPage from "../FarmerAddItemsPage/addItemPage";

export default function FarmerPage() {
  const [userValidated, setUserValidated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      window.location.href = "/login";
    }
    axios
      .get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const user = res.data;
        if (user.role === "farmer") {
          setUserValidated(true);
        } else {
          window.location.href = "/farmer/";
        }
      })
      .catch((err) => {
        console.error(err);
        setUserValidated(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col p-5 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          🌱 AgriDashboard
        </h1>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/farmer/orders"
            className="flex items-center gap-2 text-lg font-medium p-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            <FaRegBookmark size={20} /> Orders
          </Link>
          <Link
            to="/farmer/items"
            className="flex items-center gap-2 text-lg font-medium p-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            <MdOutlineSpeaker size={20} /> Items
          </Link>
          <Link
            to="/farmer/users"
            className="flex items-center gap-2 text-lg font-medium p-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            <FaRegUser size={20} /> Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow-md p-5 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            <BsGraphDown size={28} className="text-green-600" /> Farmer
            Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Manage products, users, and orders efficiently.
          </p>
        </div>

        {userValidated && (
          <div className="mt-6">
            <Routes>
              <Route path="/items" element={<FarmerItemsPage />} />
              <Route path="/items/add" element={<AddItemPage />} />
              <Route path="/items/edit" element={<UpdateItemPage />} />
            </Routes>
          </div>
        )}
      </main>
    </div>
  );
}
