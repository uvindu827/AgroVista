import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/agricultureinspector/Sidebar";
import Footer from "../components/Footer/Footer";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
