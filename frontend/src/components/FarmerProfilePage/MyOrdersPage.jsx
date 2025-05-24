import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (orders.length === 0) {
    return <div>You have no orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order ID:</span>
              <span>{order.orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Status:</span>
              <span>{order.status}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Items:</span>
              <ul className="list-disc list-inside">
                {order.orderedItems.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - Quantity: {item.quantity} - Price: LKR{" "}
                    {item.price !== undefined ? item.price.toFixed(2) : "N/A"}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span>
                LKR{" "}
                {order.totalAmount !== undefined
                  ? order.totalAmount.toFixed(2)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Order Date:</span>
              <span>{new Date(order.orderDate).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
