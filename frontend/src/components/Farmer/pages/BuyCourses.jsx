import React, { useEffect, useState } from "react";
import API from "../pages/api/api";
// import { useAuth } from "../pages/context/AuthContext"; // Removed unused import
import toast from "react-hot-toast";
import StripeBuyNowButton from "../pages/Stripe/StripeCheckoutButton";

export default function BuyCourses() {
  // const { user } = useAuth(); // Removed unused variable
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 6;

  const fetchCourses = async () => {
    try {
      const response = await API.get(`/courses`);
      setCourses(response.data);
      setTotalPages(Math.ceil(response.data.length / coursesPerPage));
    } catch (err) {
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addToCart = async (courseId) => {
    try {
      await API.post(`/cart/add`, { courseId });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Online icon URLs
  const ICONS = {
    leaf: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
    tractor: "https://cdn-icons-png.flaticon.com/512/616/616494.png",
    book: "https://cdn-icons-png.flaticon.com/512/29/29302.png",
    calendar: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
    money: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    cart: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png",
  };

  return (
    <div className="relative min-h-screen">
      {/* Farm landscape background from Unsplash */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
          alt="Farm Landscape"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-200 opacity-80"></div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center flex items-center justify-center gap-4">
          <img src={ICONS.leaf} alt="Leaf" className="h-10 w-10 inline-block" />
          Explore Agriculture Courses
          <img src={ICONS.tractor} alt="Tractor" className="h-10 w-10 inline-block" />
        </h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search courses..."
            className="p-3 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-400 w-full max-w-lg shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-center text-lg text-green-700">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white bg-opacity-90 border border-green-200 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out p-6 flex flex-col justify-between relative group"
              >
                <div className="absolute top-4 right-4">
                  {course.coordinator && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
                      <img src={ICONS.leaf} alt="Coordinator" className="h-4 w-4 inline-block" /> Coordinator
                    </span>
                  )}
                </div>
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-44 object-cover rounded-xl mb-4 border border-green-100 group-hover:scale-105 transition-transform duration-300"
                  style={{ background: '#f3f3f3' }}
                />
                <h2 className="text-2xl font-bold text-green-800 mb-2 flex items-center gap-2">
                  <img src={ICONS.book} alt="Book" className="h-6 w-6 inline-block" /> {course.title}
                </h2>
                <p className="text-gray-700 mb-2 text-sm line-clamp-3">{course.description}</p>
                <div className="flex flex-col items-center justify-center gap-2 mb-4">
                  <div className="flex gap-2 justify-center mb-2">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm font-semibold shadow">
                      <img src={ICONS.calendar} alt="Calendar" className="h-5 w-5 inline-block" /> Start: {new Date(course.startingdate).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm font-semibold shadow">
                      <img src={ICONS.calendar} alt="Calendar" className="h-5 w-5 inline-block" /> End: {new Date(course.enddate).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-extrabold border-2 border-yellow-500 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-300 text-yellow-900 shadow-lg" style={{letterSpacing: '1px'}}>
                    <img src={ICONS.money} alt="Money" className="h-6 w-6 inline-block" />
                    Fee: Rs.{" "}
                    <span className="text-yellow-900" style={{fontSize: '1.25rem'}}>
                      {(course.coursefee ?? 0).toLocaleString("en-LK", {
                        style: "currency",
                        currency: "LKR",
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => addToCart(course._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-lg border-2 border-green-500 bg-gradient-to-r from-green-200 via-green-400 to-green-300 text-green-900 shadow hover:scale-105 hover:border-green-700 hover:from-green-300 hover:to-green-500 transition-all duration-200"
                    style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.10)', outline: 'none' }}
                  >
                    <img src={ICONS.cart} alt="Cart" className="h-4 w-4 inline-block" /> Add
                  </button>
                  <div className="flex-1 flex items-center">
                    <StripeBuyNowButton 
                      courseId={course._id} 
                      cartMode={false} 
                      className="px-3 py-1 text-sm font-semibold rounded-lg border-2 border-yellow-500 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-300 text-yellow-900 shadow hover:scale-105 hover:border-yellow-700 hover:from-yellow-300 hover:to-yellow-500 transition-all duration-200 flex items-center gap-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={prevPage}
            className="px-6 py-2 bg-green-200 text-green-800 rounded-full font-semibold shadow hover:bg-green-300 transition"
          >
            ⬅️ Previous
          </button>
          <span className="text-lg font-bold text-green-700">Page {page}</span>
          <button
            onClick={nextPage}
            className="px-6 py-2 bg-green-200 text-green-800 rounded-full font-semibold shadow hover:bg-green-300 transition"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
