import React, { useEffect, useState } from "react";
import {
  Package,
  Calendar,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        const processedOrders = data.map((order) => ({
          ...order,
          totalAmount:
            order.totalAmount && order.totalAmount !== "N/A"
              ? order.totalAmount
              : order.orderedItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ),
          orderDate:
            order.orderDate && !isNaN(new Date(order.orderDate).getTime())
              ? order.orderDate
              : new Date().toISOString(),
        }));

        setOrders(processedOrders);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfigs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
      },
      accepted: {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle,
      },
      declined: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: AlertCircle,
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: Package,
      },
      shipped: {
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: Package,
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: AlertCircle,
      },
    };

    const config =
      statusConfigs[status?.toLowerCase()] || statusConfigs["pending"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600">Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            My Orders
          </h1>
          <p className="text-gray-600">
            Track your order history and status
          </p>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-700">Order ID:</span>
                    <span className="font-mono text-blue-600 font-medium">
                      {order.orderId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">Items:</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {order.orderedItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 capitalize">
                            {item.name}
                          </span>
                          <span className="text-gray-600 ml-2">
                            × {item.quantity}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            LKR {item.price?.toFixed(2) || "0.00"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Subtotal: LKR {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Farmer's response */}
              {["Accepted", "Declined"].includes(order.status) && order.notes && (
                <div
                  className={`mt-2 text-sm p-3 rounded border ${
                    order.status === "Accepted"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {order.status === "Accepted" ? (
                    <span>Farmer accepted your order.</span>
                  ) : (
                    <span>
                      Farmer declined your order: <i>{order.notes}</i>
                    </span>
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">Total:</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    LKR {order.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors font-medium">
                    Order Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
