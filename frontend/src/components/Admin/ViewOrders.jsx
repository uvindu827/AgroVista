import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Farmer/pages/context/AuthContext";
import toast from "react-hot-toast";

const ViewOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        toast.error("Failed to load orders.");
      }
    };
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Order ${newStatus}`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
              <div>
                <strong>Courses:</strong>
                <ul className="list-disc ml-6">
                  {order.orderedItems.map((item, idx) => (
                    <li key={idx}>
                      {item.courseTitle} — Rs.{item.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleStatusChange(order._id, "Paid")}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleStatusChange(order._id, "Declined")}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
