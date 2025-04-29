import React from 'react'
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar'

function BuyerHomePage() {
  return (
    <div className="flex h-screen">
      {/* Navigation Bar (Left Side) */}
      <div className="w-1/4">
        <BuyerNavBar />
      </div>

      {/* Content Area (Right Side) */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-green-900">Welcome to Buyer Inventory System</h1>
        <p className="mt-4 text-gray-700">Manage your inventory efficiently.</p>
      </div>
    </div>
  )
}

export default BuyerHomePage
