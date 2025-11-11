import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

export default function InspectorAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // You can add inspector location or context here if needed
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const res = await axios.post(`${apiBase}/api/ai-assistant/chat`, {
        message: input,
        location: { lat: 0, lng: 0 }, // Replace with real location if available
      });
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: res.data.reply }
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "Sorry, I couldn't get a response." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 16, padding: 24, maxWidth: 480, margin: "32px auto", boxShadow: "0 4px 24px rgba(34,197,94,0.10)" }}>
      <h2 style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.5rem", marginBottom: 12 }}>AI Assistant</h2>
      <div style={{ minHeight: 120, marginBottom: 16 }}>
        {messages.length === 0 && <div style={{ color: "#888" }}>Ask a question about agriculture, compliance, or best practices.</div>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "8px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block",
              background: msg.role === "user" ? "#38b2ac" : "#e0f2fe",
              color: msg.role === "user" ? "#fff" : "#166534",
              borderRadius: 12,
              padding: "8px 16px",
              maxWidth: "80%"
            }}>{msg.content}</span>
          </div>
        ))}
        {loading && <div style={{ color: "#aaa" }}>Thinking...</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Type your question..."
          style={{ flex: 1, borderRadius: 8, border: "1px solid #38b2ac", padding: "8px 12px" }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          style={{ background: "linear-gradient(90deg, #38b2ac 0%, #22c55e 100%)", color: "#fff", fontWeight: 600, border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer" }}
          disabled={loading}
        >
          Send
        </button>
        {/* Crop detection shortcut removed */}
      </div>
    </div>
  );
}
