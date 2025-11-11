import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LowPurchaseAlert() {
  const [lowCourses, setLowCourses] = useState([]);

  useEffect(() => {
    const fetchLowCourses = async () => {
      try {
        const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await axios.get(`${apiBase}/api/courses/low-purchases`, { headers });
        setLowCourses(res.data);
      } catch (err) {
        console.error("Error fetching low-purchase courses", err);
      }
    };
    fetchLowCourses();
  }, []);

  if (lowCourses.length === 0) return null;

  return (
    <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: 16, marginBottom: 24 }}>
      <h3 style={{ color: "#92400e", fontWeight: "bold", fontSize: "1.1rem" }}>⚠️ Low Enrolment Courses</h3>
      <ul style={{ color: "#78350f", marginTop: 8 }}>
        {lowCourses.map((c) => (
          <li key={c._id}>{c.title} — only {c.registeredCount || 0} registered users</li>
        ))}
      </ul>
    </div>
  );
}
