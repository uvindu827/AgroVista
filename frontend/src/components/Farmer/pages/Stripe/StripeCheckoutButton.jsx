import React from "react";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import API from "../api/api";
import toast from "react-hot-toast";

// Replace with your real Stripe publishable key
const stripePromise = loadStripe("pk_test_YourStripePublicKey");

export default function StripeCheckoutButton({ cartMode = true, courseId = null }) {
  const { user } = useAuth();
  const handleCheckout = async () => {
    try {
      await stripePromise; // Only load, don't assign

      const payload = cartMode
        ? { cart: true, userId: user?._id || user?.id }
        : { courseId: courseId, userId: user?._id || user?.id };

      // Use correct backend endpoint for Stripe session creation
      const response = await API.post("/courses/checkout-session", payload);

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Payment initiation failed: no session URL");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        backgroundColor: "#28a745",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "10px"
      }}
    >
      Proceed to Checkout
    </button>
  );
}
