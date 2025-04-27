import React from 'react'
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar'

function BuyerHomePage() {
  return (
    <div className="flex h-screen bg-gradient-to-b from-green-200 to-green-400">
      {/* Navigation Bar (Left Side) */}
      <div className="w-1/4">
        <BuyerNavBar />
      </div>

      {/* Content Area (Right Side) */}
      <div className="flex-1 p-6 bg-gradient-to-b from-green-200 to-green-400">
        <h1 className="text-4xl font-bold text-green-900 mb-6 animate__animated animate__fadeIn">
          Welcome to AgroVista Buyer Inventory System !
        </h1>
        <p className="text-xl text-gray-800 mb-8 animate__animated animate__fadeIn animate__delay-1s">
          Manage your inventory efficiently and track your products in a simple, user-friendly interface.
        </p>

        {/* Hero Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Track Inventory</h2>
            <p className="text-gray-600">Keep track of your product quantities and expiration dates.</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">
              Manage Now
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Product Insights</h2>
            <p className="text-gray-600">Analyze your product data and make informed decisions.</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">
              View Insights
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Manage Products</h2>
            <p className="text-gray-600">Add, update, or remove products from your inventory.</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">
              Start Managing
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6 animate__animated animate__fadeIn animate__delay-2s">
            Explore the system and start managing your inventory with ease. Every feature is designed to help you stay on top of your business.
          </p>
          <button className="px-8 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition duration-300 transform hover:scale-105">
            Explore Features
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyerHomePage
