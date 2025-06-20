import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function PurchasePage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [orderStatus, setOrderStatus] = useState(null);

  // Personal info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Address info state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    // Decode JWT token to get personal info
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFirstName(decoded.firstName || "");
        setLastName(decoded.lastName || "");
        setEmail(decoded.email || "");
        setPhone(decoded.phone || "");
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products/");
        const allProducts = response.data;
        const filteredProducts = allProducts.filter((product) =>
          cart.some((item) => item.key && item.key === product.key)
        );
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (orderStatus === "success" || orderStatus === "failure") {
      const timer = setTimeout(() => {
        window.location.href = "/items";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.key === item.key);
      if (!product) return sum;
      return sum + product.price * item.qty;
    }, 0);
  };

  const deliveryFee = 0;
  const transactionFee = calculateSubtotal() * 0.03;
  const total = calculateSubtotal() + deliveryFee + transactionFee;

  const handleConfirmCOD = async () => {
    try {
      const token = localStorage.getItem("token");
      const fullAddress = `${address}, ${city}, ${postalCode}`.trim();
      if (!fullAddress || fullAddress === ", ,") {
        alert("Please enter a valid address.");
        return;
      }
      const orderData = {
        orderedItems: cartItems,
        totalAmount: total,
        paymentMethod: "cod",
        buyerInfo: {
          firstName,
          lastName,
          email,
          phone,
        },
        address: fullAddress,
      };
      console.log("Order data to send:", orderData);
      await axios.post("http://localhost:3000/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("cart");
      setOrderStatus("success");
    } catch (error) {
      setOrderStatus("failure");
    }
  };

  if (loading) return <div>Loading order summary...</div>;

  if (orderStatus === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-green-600">
          Order placed successfully! Thank you for your purchase.
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Redirecting to items page...
        </p>
      </div>
    );
  }

  if (orderStatus === "failure") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">
          Failed to place order. Please try again.
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          You will be redirected shortly...
        </p>
        <button
          onClick={() => setOrderStatus(null)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <button
          className="text-blue-600 flex items-center mb-6"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-8 text-center">Secure Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg mb-4">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="First Name"
                  className="input-style"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  placeholder="Last Name"
                  className="input-style"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  placeholder="Email"
                  className="input-style"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="Phone"
                  className="input-style"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg mb-4">
                Delivery Information
              </h2>
              <input
                placeholder="Address"
                className="input-style mb-4 w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="City"
                  className="input-style"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  placeholder="Postal Code"
                  className="input-style"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <textarea
                placeholder="Delivery Instructions (Optional)"
                className="input-style mt-4 w-full"
                rows={3}
              />
            </div>

            {/* Payment */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>

              <div className="space-y-4">
                <label className="flex items-center space-x-3"></label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === "cod" ? (
                <button
                  onClick={handleConfirmCOD}
                  className="mt-6 bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600"
                >
                  Confirm Cash on Delivery
                </button>
              ) : (
                <button className="mt-6 bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600">
                  Proceed to Pay with Visa
                </button>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = products.find((p) => p.key === item.key);
                if (!product) return null;
                return (
                  <div
                    key={item.key}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image[0]}
                        className="w-12 h-12 rounded"
                        alt={product.name}
                      />
                      <div>
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.qty}
                        </p>
                      </div>
                    </div>
                    <span>LKR {(product.price * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}

              <hr />

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>LKR {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>LKR {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Fee (3%)</span>
                  <span>LKR {transactionFee.toFixed(2)}</span>
                </div>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
