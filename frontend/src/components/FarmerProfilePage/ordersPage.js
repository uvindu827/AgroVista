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
  }, [token]);

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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? response.data.order : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const getOrderTotal = (order) => {
    if (order.totalAmount && order.totalAmount > 0) return order.totalAmount;
    return order.orderedItems?.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

  const totalAmount = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">All Orders</h2>

      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-8 shadow-md text-center">
        <h3 className="text-lg font-semibold">Total Order Amount</h3>
        <p className="text-2xl font-bold text-blue-700">
          LKR {totalAmount.toFixed(2)}
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-6 shadow-lg bg-white"
            >
              <div className="flex justify-between flex-wrap gap-4 mb-4">
                <div><span className="font-semibold">Order ID:</span> {order.orderId}</div>
                <div><span className="font-semibold">Date:</span> {new Date(order.date).toLocaleDateString()}</div>
                <div><span className="font-semibold">Status:</span> {order.status}</div>
                <div><span className="font-semibold">Total:</span> LKR {getOrderTotal(order).toFixed(2)}</div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="space-y-3">
                  {order.orderedItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 border p-2 rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.quantity} | Price: LKR {item.price.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {order.notes && (
                <div className="mt-4">
                  <span className="font-semibold">Notes:</span> {order.notes}
                </div>
              )}

              {order.status === "Pending" && (
                <div className="mt-6 flex gap-4">
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
