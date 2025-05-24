import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]); // include token as it's used in the function

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? response.data.order : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <div className="flex justify-between mb-2 flex-wrap gap-2">
                <div>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order.orderId}
                </div>
                <div>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {order.status}
                </div>
                <div>
                  <span className="font-semibold">Total:</span> LKR{" "}
                  {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul>
                  {order.orderedItems.map((item, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <div>{item.name}</div>
                        <div>
                          Quantity: {item.quantity} | Price: LKR{" "}
                          {item.price ? item.price.toFixed(2) : "0.00"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {order.notes && (
                <div className="mt-2">
                  <span className="font-semibold">Notes:</span> {order.notes}
                </div>
              )}
              {order.status === "Pending" && (
                <div className="mt-4 space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => updateOrderStatus(order.orderId, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => updateOrderStatus(order.orderId, "Declined")}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
