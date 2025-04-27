import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { buyerId } = state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your order has been placed and is being processed.
        </p>
        <button
          onClick={() => navigate(`/buyer/${buyerId}`)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
}
