// components/Inspector/InspectorCoursePurchases.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../pages/context/AuthContext";
import socket from "../../socket";

const InspectorCoursePurchases = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();

    // Connect to socket server
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    // Listen for new orders
    socket.on("new_order", (order) => {
      toast.success("New course purchased!");
      setOrders((prev) => [order, ...prev]);
    });

    return () => {
      socket.off("new_order");
      socket.disconnect();
    };
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Course Purchases</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded bg-white shadow">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Buyer:</strong> {order.name} ({order.email})</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="mt-2">
                <strong>Courses:</strong>
                <ul className="list-disc list-inside">
                  {order.orderedItems.map((course) => (
                    <li key={course._id}>{course.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspectorCoursePurchases;
