import React, { useEffect, useState } from "react";
import API from "../pages/api/api";
import { useAuth } from "../pages/context/AuthContext";
import toast from "react-hot-toast";
import StripeBuyNowButton from "../pages/Stripe/StripeCheckoutButton";

export default function BuyCourses() {
  const { user } = useAuth();
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
      // Send products as an array for backend compatibility
      await API.post(`/cart/add`, {
        customerId: user?._id,
        buyerId: user?.buyerId || "",
        products: [{ productId: courseId, quantity: 1 }],
      });
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>

      <input
        type="text"
        placeholder="Search courses..."
        className="p-2 border rounded mb-4 w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <div
              key={course._id}
              className="border p-4 rounded-xl shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-sm text-gray-600 mb-1">
                {course.description}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Start: {new Date(course.startingdate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                End: {new Date(course.enddate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-800 font-semibold mb-2">
                Fee: Rs.{" "}
                {(course.coursefee ?? 0).toLocaleString("en-LK", {
                  style: "currency",
                  currency: "LKR",
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(course._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>
                <StripeBuyNowButton course={course} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg font-medium">Page {page}</span>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
