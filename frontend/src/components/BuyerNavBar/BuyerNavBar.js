import React from 'react'
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaPlus, FaList, FaShoppingCart, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";


function BuyerNavBar() {

    


  return (
    

    <div className="w-64 bg-green-900 text-white flex flex-col h-screen py-6 px-4 shadow-lg">
      {/* Welcome Title */}
      <h2 className="text-2xl font-bold text-yellow-400 pb-6">WELCOME</h2>

      {/* Navigation Links */}
      <nav className="space-y-4 flex-grow">
        <Link to="/dashboard" className="flex items-center space-x-2 hover:text-yellow-400">
          <MdDashboard /> <span>DASHBOARD</span>
        </Link>
        <Link to="/add-product" className="flex items-center space-x-2 hover:text-yellow-400">
          <FaPlus /> <span>ADD PRODUCT</span>
        </Link>
        <Link to="/manage-products" className="flex items-center space-x-2 hover:text-yellow-400">
          <BsBoxSeam /> <span>MANAGE PRODUCTS</span>
        </Link>
        <Link to="/manage-sales" className="flex items-center space-x-2 hover:text-yellow-400">
          <FaShoppingCart /> <span>MANAGE SALES</span>
        </Link>
        <Link to="/manage-purchases" className="flex items-center space-x-2 hover:text-yellow-400">
          <FaList /> <span>MANAGE PURCHASES</span>
        </Link>
        <Link to="/newsfeed" className="flex items-center space-x-2 hover:text-yellow-400">
          <FaUser /> <span>NEWS FEED</span>
        </Link>*
      </nav>

      {/* Logout Button at Bottom */}
      <Link to="/" className="flex items-center space-x-2 text-red-400 hover:text-red-500 mt-6">
        <FaSignOutAlt /> <span>LOGOUT</span>
      </Link>

      
    </div>
  )
}

export default BuyerNavBar
