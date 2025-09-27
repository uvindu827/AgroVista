import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import API from "../api/api";
import toast from "react-hot-toast";

// Replace with your real Stripe publishable key
const stripePromise = loadStripe("pk_test_YourStripePublicKey");

export default function StripeCheckoutButton({ cartMode = true, courseId = null }) {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      const payload = cartMode
        ? { cart: true }
        : { courseId: courseId };

      const response = await API.post("/create-checkout-session", payload);

      if (response.data.id) {
        await stripe.redirectToCheckout({ sessionId: response.data.id });
      } else {
        toast.error("Payment initiation failed: no session ID");
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
