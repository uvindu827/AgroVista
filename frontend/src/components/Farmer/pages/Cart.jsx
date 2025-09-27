import React, { useEffect, useState } from "react";
import API from "../pages/api/api";
import { useAuth } from "../pages/context/AuthContext";
import toast from "react-hot-toast";
import StripeCheckoutButton from "../pages/Stripe/StripeCheckoutButton";

export default function Cart() {
  const { token } = useAuth();
  const [cartCourses, setCartCourses] = useState([]);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCourses(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      toast.error("Failed to load cart");
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      await API.delete(`/cart/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Remove from cart failed", error);
      toast.error("Failed to remove course from cart");
    }
  };

  const totalPrice = cartCourses.reduce((sum, course) => sum + course.price, 0);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>🛒 Your Cart</h2>
      {cartCourses.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cartCourses.map((course) => (
              <li
                key={course._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "1rem",
                }}
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  style={{
                    width: "100px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "1rem",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{course.title}</h4>
                  <p style={{ margin: 0, color: "gray" }}>
                    LKR {course.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(course._id)}
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
