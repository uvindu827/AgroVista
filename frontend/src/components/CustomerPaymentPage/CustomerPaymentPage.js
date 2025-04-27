import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function CustomerPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state from location and add default values for safety
  const { totalAmount, cartId, products = [], customerId, buyerId } = location.state || {}; // Default to empty array for products

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerContactNumber, setCustomerContactNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentOption, setPaymentOption] = useState('Cash on Delivery');
  const [orderDetails, setOrderDetails] = useState([]);

  // validation state
  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Ensure product price and quantity are valid numbers
  const calculateTotalPrice = (price, quantity) => {
    const parsedPrice = parseFloat(price);  // Parse price to ensure it is a number
    const parsedQuantity = parseInt(quantity, 10);  // Parse quantity to ensure it is a number
    if (isNaN(parsedPrice) || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return 0;  // Return 0 if any value is invalid or quantity is zero or negative
    }
    return parsedPrice * parsedQuantity;
  };

  useEffect(() => {
    // Log location.state to debug the issue
    console.log('Location State:', location.state); // Check if products are being passed

    if (products.length > 0) {
      const details = products.map(product => {
        // Log the product fields for debugging
        console.log('Product:', product);
        
        // Ensure we have valid data before proceeding
        const totalPrice = calculateTotalPrice(product.price, product.quantity);
        return {
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
          totalPrice: totalPrice, // Calculate total for each product
        };
      });
      setOrderDetails(details);
    }
  }, [products]);

  // form validation function
  const validate = () => {
    const errs = {};
    if (!/^[A-Za-z\s]+$/.test(customerName)) errs.customerName = 'Name can only contain letters and spaces';
    if (!customerAddress.trim()) errs.customerAddress = 'Address is required';
    if (!/^[0-9]{10}$/.test(customerContactNumber)) errs.customerContactNumber = 'Contact must be 10 digits';
    if (!/\S+@\S+\.\S+/.test(customerEmail)) errs.customerEmail = 'Invalid email address';
    return errs;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // run validation
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        customerId,
        buyerId,
        customerName,
        customerAddress,
        customerContactNumber,
        customerEmail,
        paymentOption,
        cartId,
        orderDate: new Date().toISOString(), // Setting current date
        products: orderDetails,
      };

      const response = await axios.post(`${API_URL}/api/orders/placeOrder`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-green-500 text-white font-semibold p-4 rounded-lg shadow-lg',
      });

      navigate('/ordersuccess', { state: { orderData: response.data } });
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-white flex justify-center items-center">
      <form onSubmit={handlePlaceOrder} className="bg-gradient-to-b from-green-100 p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-green-900 text-center">Payment Details</h2>

        {/* User input fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={`w-full p-2 border rounded ${errors.customerName ? 'border-red-500' : 'border-green-400'}`}
            required
          />
          {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Customer Address</label>
          <textarea
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className={`w-full p-2 border rounded ${errors.customerAddress ? 'border-red-500' : 'border-green-400'}`}
            required
          />
          {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
          <input
            type="text"
            value={customerContactNumber}
            onChange={(e) => setCustomerContactNumber(e.target.value)}
            className={`w-full p-2 border rounded ${errors.customerContactNumber ? 'border-red-500' : 'border-green-400'}`}
            required
            maxLength="10"
          />
          {errors.customerContactNumber && <p className="text-red-500 text-sm mt-1">{errors.customerContactNumber}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className={`w-full p-2 border rounded ${errors.customerEmail ? 'border-red-500' : 'border-green-400'}`}
            required
          />
          {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Payment Option</label>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full p-2 border border-green-400 rounded"
            required
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card Payment">Card Payment</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-green-700">Total: Rs. {isNaN(totalAmount) ? 'N/A' : totalAmount.toFixed(2)}</h3>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          Confirm and Place Order
        </button>
      </form>
    </div>
  );
}

export default CustomerPaymentPage;
