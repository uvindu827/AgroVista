import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FarmerSidebar from "./FarmerSidebar";
import Footer from "../Footer/Footer";

import Home from "./pages/Home";
import BuyCourses from "./pages/BuyCourses";
import Assistant from "./pages/Assistant";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import PurchasedCourses from "../Farmer/PaidCourses.jsx"; // Adjust path here!

export default function FarmerDashboard() {
  return (
    <div className="flex min-h-screen bg-green-50">
      <FarmerSidebar />

      <div className="flex flex-col flex-1">
        <main className="flex-grow p-6">
          <Routes>
            <Route index element={<Navigate to="/farmer/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/buy-courses" element={<BuyCourses />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/paid-courses" element={<PurchasedCourses />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
