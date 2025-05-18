import React, { useEffect, useState } from "react";
import { loadCart, addToCart, removeFromCart } from "../utils/cartFunction";
import axios from "axios";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cart = loadCart();
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
        setError("Failed to load products");
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  const updateQuantity = (key, delta) => {
    addToCart(key, delta);
    const updatedCart = loadCart();
    setCartItems(updatedCart);
  };

  const removeProduct = (key) => {
    removeFromCart(key);
    const updatedCart = loadCart();
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.key === item.key);
      if (!product) return sum;
      return sum + product.price * item.qty;
    }, 0);
  };

  const handleCheckout = () => {
    alert("Checkout functionality to be implemented.");
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <ul>
        {cartItems.map((item, index) => {
          if (!item.key) {
            return (
              <li key={index} className="mb-4 p-2 border rounded text-red-600">
                Invalid cart item detected.
              </li>
            );
          }
          const product = products.find((p) => p.key === item.key);
          if (!product) {
            return (
              <li key={index} className="mb-4 p-2 border rounded text-yellow-600">
                Product with key "{item.key}" not found.
              </li>
            );
          }
          return (
            <li key={index} className="flex items-center mb-4 border p-2 rounded">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Price: ${product.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-gray-300 px-2 rounded"
                    onClick={() => updateQuantity(item.key, -1)}
                    disabled={item.qty <= 1}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    className="bg-gray-300 px-2 rounded"
                    onClick={() => updateQuantity(item.key, 1)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded ml-4"
                    onClick={() => removeProduct(item.key)}
                  >
                    Remove
                  </button>
                </div>
                <p>Total: ${(product.price * item.qty).toFixed(2)}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total: ${calculateTotal().toFixed(2)}
        </div>
        <button
          className="bg-green-800 text-white px-6 py-2 rounded hover:bg-green-900"
          onClick={handleCheckout}
        >
          Checkout & Payment
        </button>
      </div>
    </div>
  );
}
