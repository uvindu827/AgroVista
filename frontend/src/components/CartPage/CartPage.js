import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Cart() {
  const [cart, setCart] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId || localStorage.getItem('ID');
  const buyerId = location.state?.buyerId || localStorage.getItem('buyerId');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !customerId || !buyerId) {
          toast.error('Authentication required', {
            position: 'top-right',
            autoClose: 3000,
            className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg',
            progressClassName: 'bg-white',
          });
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/cart/${encodeURIComponent(customerId)}/${encodeURIComponent(buyerId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCart(response.data);
        calculateTotalAmount(response.data.products);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Error fetching cart', {
          position: 'top-right',
          autoClose: 3000,
          className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg',
          progressClassName: 'bg-white',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [customerId, buyerId, navigate, API_URL]);

  const calculateTotalAmount = (products) => {
    let total = 0;
    products.forEach((item) => {
      total += item.totalPrice;
    });
    setTotalAmount(total);
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/api/cart/${encodeURIComponent(customerId)}/${encodeURIComponent(buyerId)}/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart(response.data);
      calculateTotalAmount(response.data.products);

      if (response.data.products.length === 0) {
        navigate(`/buyer/${buyerId}/inventory`);
      } else {
        toast.success('Product removed from cart', {
          position: 'top-right',
          autoClose: 3000,
          className: 'bg-green-500 text-white font-semibold p-4 rounded-lg shadow-lg',
          progressClassName: 'bg-white',
        });
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Error removing product from cart', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg',
        progressClassName: 'bg-white',
      });
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return;
    }

    const updatedProducts = cart.products.map((item) => {
      if (item.productId._id === productId) {
        const updatedItem = { ...item, quantity: newQuantity };
        updatedItem.totalPrice = updatedItem.quantity * updatedItem.pricePerKg;
        return updatedItem;
      }
      return item;
    });

    setCart({ ...cart, products: updatedProducts });
    calculateTotalAmount(updatedProducts);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/cart/${encodeURIComponent(customerId)}/${encodeURIComponent(buyerId)}/product/${productId}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Cart updated successfully', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-green-500 text-white font-semibold p-4 rounded-lg shadow-lg',
        progressClassName: 'bg-white',
      });
    } catch (error) {
      console.error('Error updating product quantity:', error);
      toast.error('Error updating cart', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg',
        progressClassName: 'bg-white',
      });
    }
  };

  const handleCheckout = () => {
    navigate(`/buyer/${buyerId}/inventory`);
  };

  const handlePay = () => {
    // Create an array of product details (including ID and other necessary details)
    const productDetails = cart.products.map((product) => ({
      productId: product.productId._id,
      productName: product.productName,
      quantity: product.quantity,
      pricePerKg: product.pricePerKg,
      totalPrice: product.totalPrice,
    }));

    // Navigate to the payment page, passing the product details and other necessary data
    navigate('/customer-order', {
      state: {
        totalAmount,
        customerId,
        buyerId,
        cartId: cart._id,
        productDetails, // Passing the product details for the payment process
      },
    });
  };

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center bg-gradient-to-b from-green-300 text-center text-xl font-bold text-green-900 text-lg font-semibold">
        Loading your cart...
      </div>
    );
  }

  const products = Array.isArray(cart.products) ? cart.products : [];

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-300 text-center text-xl font-bold text-green-900">
        Your cart is empty! Continue shopping to add products to your cart.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-green-900 text-center mb-8">Your Cart</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto rounded-lg shadow-md">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Product Name</th>
                <th className="py-3 px-6 text-left">Price (Per Kg)</th>
                <th className="py-3 px-6 text-left">Quantity</th>
                <th className="py-3 px-6 text-left">Total Price</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.productId._id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6">{item.productName}</td>
                  <td className="py-4 px-6">Rs.{item.pricePerKg}</td>
                  <td className="py-4 px-6">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId._id, parseFloat(e.target.value))
                      }
                      className="w-16 text-center p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </td>
                  <td className="py-4 px-6">Rs.{item.totalPrice}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleRemoveProduct(item.productId._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-green-800">Total Amount : Rs.{totalAmount}</h3>
          <div className="flex space-x-4">
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Checkout
            </button>
            <button
              onClick={handlePay}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;