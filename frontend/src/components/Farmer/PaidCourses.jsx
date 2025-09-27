// src/components/Farmer/pages/PaidCourses.jsx
import React, { useEffect, useState } from "react";
import API from "../Farmer/pages/api/api";
import { useAuth } from "../Farmer/pages/context/AuthContext";

export default function PaidCourses() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/order/paid-courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching paid courses:", err);
      }
    };

    if (user) fetchCourses();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses purchased yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="border rounded-lg p-4 shadow hover:shadow-md">
              <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover mb-2" />
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
