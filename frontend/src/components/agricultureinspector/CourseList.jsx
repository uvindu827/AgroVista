import React, { useState, useEffect, useMemo, useCallback } from "react";
import CreativeCourseCarousel from "./CreativeCourseCarousel";
import LowPurchaseAlert from "./LowPurchaseAlert";
import InspectorAssistant from "./InspectorAssistant";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const token = localStorage.getItem("token");
  const config = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  // --- Creative background ---
  const backgroundUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"; // Agriculture inspection themed

  // Stripe payment
  const handleStripePayment = async (courseId) => {
    toast('Stripe payment not implemented yet.');
  };

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const deletedQuery = filterStatus === "deleted" ? "true" : "false";
      const res = await axios.get(`http://localhost:3000/api/courses?deleted=${deletedQuery}`, config);
      setCourses(res.data || []);
    } catch {
      toast.error("Failed to load courses");
    }
    setLoading(false);
  }, [filterStatus, config]);

  useEffect(() => {
    fetchCourses();
    setCurrentPage(1);
  }, [fetchCourses]);

  // Load user info
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Filtering + searching
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.coordinator && course.coordinator.toLowerCase().includes(searchTerm.toLowerCase()));
      const fee = Number(course.coursefee);
      let matchesPrice = true;
      if (priceFilter === "below20k") matchesPrice = fee < 20000;
      else if (priceFilter === "above20k") matchesPrice = fee >= 20000;
      return matchesSearch && matchesPrice;
    });
  }, [courses, searchTerm, priceFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, currentPage, pageSize]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goToPage = (page) => setCurrentPage(page);

  // Course actions
  const handleDelete = async (courseId) => {
    const confirm = await Swal.fire({
      title: "Delete Course?",
      text: "Are you sure you want to delete this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/courses/${courseId}`, config);
        toast.success("Course deleted successfully");
        fetchCourses();
      } catch {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleRestore = async (courseId) => {
    try {
      await axios.patch(`http://localhost:3000/api/courses/${courseId}/restore`, {}, config);
      toast.success("Course restored successfully");
      fetchCourses();
    } catch {
      toast.error("Failed to restore course");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={backgroundUrl}
          alt="Agriculture Inspection"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(56,178,172,0.18) 0%, rgba(34,197,94,0.18) 100%)",
          }}
        ></div>
      </div>


      <div className="container mx-auto px-4 py-6" style={{ position: "relative", zIndex: 2 }}>
        <div className="mb-8"><LowPurchaseAlert /></div>
        <div className="mb-8"><InspectorAssistant /></div>

        {user && (
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 32,
                padding: "12px 32px",
              }}
            >
              <img
                src={user.avatar || "/agrologo.png"}
                alt="Profile"
                style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #22c55e" }}
              />
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#22c55e" }}>
                  {user.name || user.email}
                </div>
                <div style={{ fontSize: "1rem", color: "#38b2ac" }}>{user.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by title or coordinator..."
            className="w-full sm:w-1/3 rounded-full border border-green-300 px-4 py-2 pl-10 text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <select
            className="w-full sm:w-1/5 rounded-full border border-green-300 px-4 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={priceFilter}
            onChange={(e) => { setPriceFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">💰 All Prices</option>
            <option value="below20k">Below Rs. 20,000</option>
            <option value="above20k">Rs. 20,000 and above</option>
          </select>
          <select
            className="w-full sm:w-1/5 rounded-full border border-green-300 px-4 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="active">✅ Active Courses</option>
            <option value="deleted">🗑️ Deleted Courses</option>
          </select>
        </div>

        {/* Courses */}
        {loading ? (
          <p className="text-center text-green-600 font-semibold">Loading...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-gray-500 italic text-center">No matching courses found.</p>
        ) : (
          <CreativeCourseCarousel
            courses={paginatedCourses}
            onEdit={() => {}}
            onDelete={handleDelete}
            onStripe={handleStripePayment}
            onRestore={handleRestore}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button onClick={goPrev} disabled={currentPage === 1} className="px-4 py-2 border rounded-full text-green-700 hover:bg-green-700 hover:text-white disabled:opacity-50">Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-full border font-semibold ${currentPage === i + 1 ? "bg-green-700 text-white border-green-700" : "text-green-700 border-green-300 hover:bg-green-100"}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={goNext} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-full text-green-700 hover:bg-green-700 hover:text-white disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

