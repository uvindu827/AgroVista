// AdminDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Newspaper, UserCircle2, LayoutGrid } from "lucide-react";


function AdminDashboard() {
  const navigate = useNavigate();

  // Example quick stats (replace with real data)
  const stats = [
    { label: "Staff", value: 12, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { label: "Newsfeed Posts", value: 34, icon: <Newspaper className="w-6 h-6 text-green-500" /> },
    { label: "Inquiries", value: 7, icon: <UserCircle2 className="w-6 h-6 text-yellow-500" /> },
  ];

  const actions = [
    {
      label: "Staff Management",
      icon: <Users className="w-8 h-8" />,
      onClick: () => navigate("/staff"),
      color: "bg-blue-100 hover:bg-blue-200",
    },
    {
      label: "Newsfeed Management",
      icon: <Newspaper className="w-8 h-8" />,
      onClick: () => navigate("/nf-management"),
      color: "bg-green-100 hover:bg-green-200",
    },
    {
      label: "Inquiries Management",
      icon: <UserCircle2 className="w-8 h-8" />,
      onClick: () => navigate("/inquiries"),
      color: "bg-yellow-100 hover:bg-yellow-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome, Admin!</h1>
        <p className="text-gray-300 mb-6">Manage your platform efficiently with quick access to all admin features.</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center bg-gray-800 rounded-lg p-4 shadow">
              {stat.icon}
              <span className="text-2xl font-bold text-white mt-2">{stat.value}</span>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Dashboard Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center ${action.color} text-gray-900 font-semibold py-6 rounded-xl shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {action.icon}
              <span className="mt-3 text-lg">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
