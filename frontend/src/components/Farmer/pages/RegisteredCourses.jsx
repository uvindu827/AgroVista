import React, { useEffect, useState } from "react";
import API from "../pages/api/api";
import { useAuth } from "../pages/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisteredCourses() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      toast.error("Please login to view registered courses");
      setCourses([]);
      setLoading(false);
      return;
    }

    async function fetchRegisteredCourses() {
      try {
        const res = await API.get(`/courses/registered/${user._id}`);
        setCourses(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch registered courses");
      } finally {
        setLoading(false);
      }
    }

    fetchRegisteredCourses();
  }, [token, user]);

  if (!token || !user) {
    return (
      <div className="min-h-screen p-6 bg-green-50 text-center text-red-600 font-semibold">
        Please log in to view your registered courses.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-green-50 text-center text-green-700 font-semibold">
        Loading your registered courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-50">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        Your Registered Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven't registered for any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
            >
              <img
                src={course.imageUrl || "https://via.placeholder.com/400x150"}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-xl font-semibold text-green-800 mt-3">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{course.description}</p>
              <p className="text-green-700 font-bold mt-2">Registered</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
