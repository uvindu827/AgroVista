import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuyerOrders = ({ buyerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback to localStorage if buyerId prop is not provided
  const effectiveBuyerId = buyerId || localStorage.getItem('buyerId');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!effectiveBuyerId) {
        setError('Buyer ID is required. Please log in or select a buyer.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching orders for buyerId:', effectiveBuyerId);
        const response = await axios.get(`http://localhost:3000/api/orders/buyer/${effectiveBuyerId}`);
        console.log('Orders response:', response.data);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [effectiveBuyerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Buyer Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found for this buyer.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <p>Payment Option: {order.paymentOption}</p>
              <ul>
                {order.products.map((product, index) => (
                  <li key={index}>
                    <p>Product: {product.productName}</p>
                    <p>Quantity: {product.quantity.toFixed(1)}</p>
                    <p>Price: ${product.totalPrice.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuyerOrders;