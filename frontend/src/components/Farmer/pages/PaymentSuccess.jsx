// src/components/Farmer/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to purchased courses page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/farmer/purchases");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f9ff",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#2e7d32",
        borderRadius: "8px",
        margin: "2rem auto",
        maxWidth: "600px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
      role="alert"
      aria-live="polite"
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Payment Successful!</h1>
      <p style={{ fontSize: "1.25rem" }}>
        Thank you for your purchase. You will be redirected to your purchased courses shortly.
      </p>
    </div>
  );
};

export default PaymentSuccess;
