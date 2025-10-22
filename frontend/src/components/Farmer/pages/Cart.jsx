import React, { useEffect, useState, useCallback } from "react";
import API from "../pages/api/api";
import { useAuth } from "../pages/context/AuthContext";
import toast from "react-hot-toast";
import StripeCheckoutButton from "../pages/Stripe/StripeCheckoutButton";

export default function Cart() {
  const { token } = useAuth();
  const [cartCourses, setCartCourses] = useState([]);


  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await API.get("/cart");
      setCartCourses(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      toast.error("Failed to load cart");
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // fetchCart is now wrapped in useCallback above

  const removeFromCart = async (courseId) => {
    try {
      await API.delete(`/cart/${courseId}`);
      toast.success("Removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Remove from cart failed", error);
      toast.error("Failed to remove course from cart");
    }
  };

  const totalPrice = cartCourses.reduce((sum, item) => sum + (item.course?.coursefee || 0), 0);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>🛒 Your Cart</h2>
      {cartCourses.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cartCourses.map((item) => (
              <li
                key={item._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "1rem",
                }}
              >
                <img
                  src={item.course?.imageUrl}
                  alt={item.course?.title}
                  style={{
                    width: "100px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "1rem",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{item.course?.title}</h4>
                  <p style={{ margin: 0, color: "gray" }}>
                    LKR {(item.course?.coursefee || 0).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (item.course && item.course._id) {
                      removeFromCart(item.course._id);
                    } else {
                      toast.error("Course ID not found. Cannot remove from cart.");
                    }
                  }}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            <h3>Total: LKR {totalPrice.toLocaleString()}</h3>
            <StripeCheckoutButton cartMode={true} />
          </div>
        </>
      )}
    </div>
  );
}
