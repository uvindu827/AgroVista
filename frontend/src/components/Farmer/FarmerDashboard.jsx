import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FarmerSidebar from "./FarmerSidebar";
import Footer from "../Footer/Footer";
import Home from "./pages/Home";
import BuyCourses from "./pages/BuyCourses";
import Assistant from "./pages/Assistant";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import PurchasedCourses from "../Farmer/PaidCourses.jsx";
// ...existing code...
export default function FarmerDashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !location) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input, location })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't get an answer." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI assistant." }]);
    }
    setLoading(false);
  };
  const [chatOpen, setChatOpen] = useState(false);
  const [location, setLocation] = useState(null);
  function getLocationAndOpenChat() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setChatOpen(true);
        },
        (error) => {
          alert("Unable to fetch location. Please enable location services.");
          setChatOpen(true);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setChatOpen(true);
    }
  }
  return (
    <div className="flex min-h-screen bg-green-50">
      <FarmerSidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-grow p-6">
          <Routes>
            <Route index element={<Navigate to="/farmer/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/buy-courses" element={<BuyCourses />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/paid-courses" element={<PurchasedCourses />} />
          </Routes>
          {/* AI Assistant Button and Chat UI */}
          <button
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              background: "#22c55e",
              color: "white",
              borderRadius: "50px",
              padding: "16px 32px",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 4px 16px rgba(34,197,94,0.2)",
              zIndex: 1000,
            }}
            onClick={getLocationAndOpenChat}
          >
            Farmer's AI Assistant
          </button>
          {chatOpen && (
            <div style={{
              position: "fixed",
              bottom: "90px",
              right: "32px",
              width: "350px",
              height: "500px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{padding: "16px", borderBottom: "1px solid #e5e7eb", fontWeight: "bold", color: "#22c55e"}}>
                Farmer's AI Assistant
                <button style={{float: "right", background: "none", border: "none", color: "#888", fontSize: "18px", cursor: "pointer"}} onClick={() => setChatOpen(false)}>&times;</button>
              </div>
              <div style={{flex: 1, padding: "16px", overflowY: "auto"}}>
                <p style={{color: "#444"}}>
                  {location ? `Your location: Lat ${location.lat}, Lng ${location.lng}` : "Location not available."}
                </p>
                <div style={{marginTop: "8px", marginBottom: "8px"}}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{marginBottom: "8px"}}>
                      <span style={{fontWeight: msg.role === 'user' ? 'bold' : 'normal', color: msg.role === 'user' ? '#22c55e' : '#333'}}>
                        {msg.role === 'user' ? 'You: ' : 'AI: '}
                      </span>
                      <span>{msg.content}</span>
                    </div>
                  ))}
                  {loading && <div style={{color: '#888'}}>AI is typing...</div>}
                </div>
                <form onSubmit={handleSendMessage} style={{display: 'flex', gap: '8px'}}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    style={{flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb'}}
                    disabled={loading}
                  />
                  <button type="submit" style={{background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold'}} disabled={loading || !input.trim()}>
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Move chat state and handler above return
