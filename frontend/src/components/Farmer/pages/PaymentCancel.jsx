import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 px-4">
      <FaTimesCircle className="text-red-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-red-800">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-4">Your payment was not completed.</p>
      <Link
        to="/cart"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Return to Cart
      </Link>
    </div>
  );
};

export default PaymentCancel;
