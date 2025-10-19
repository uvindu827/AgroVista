import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LowPurchaseAlert() {
  const [lowCourses, setLowCourses] = useState([]);

  useEffect(() => {
    const fetchLowCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/courses/low-purchases");
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
