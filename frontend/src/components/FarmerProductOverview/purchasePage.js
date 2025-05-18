import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PurchasePage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("visa");

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

  if (loading) return <div>Loading order summary...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <button className="text-blue-600 flex items-center mb-6" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-8 text-center">Secure Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="First Name" className="input-style" />
                <input placeholder="Last Name" className="input-style" />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input placeholder="Email" className="input-style" />
                <input placeholder="Phone" className="input-style" />
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Delivery Information</h2>
              <input placeholder="Address" className="input-style mb-4 w-full" />
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="City" className="input-style" />
                <input placeholder="Postal Code" className="input-style" />
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
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="visa"
                    checked={paymentMethod === "visa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <img src="/visalogo.jpg" alt="Visa" className="h-6" />
                  <span>Pay with Visa Card</span>
                </label>

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

              <button className="mt-6 bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600">
                {paymentMethod === "visa" ? "Proceed to Pay with Visa" : "Confirm Cash on Delivery"}
              </button>
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
                  <div key={item.key} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img src={product.image[0]} className="w-12 h-12 rounded" alt={product.name} />
                      <div>
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.qty}</p>
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
