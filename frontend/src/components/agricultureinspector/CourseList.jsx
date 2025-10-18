// ...existing code...

const MySwal = withReactContent(Swal);

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active"); // active or deleted
  const [priceFilter, setPriceFilter] = useState("all"); // all, below20k, above20k

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // courses per page

  const token = localStorage.getItem("token");

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // Stripe payment handler (now inside component)
  const handleStripePayment = async (courseId) => {
    try {
      const userId = localStorage.getItem("userId"); // Adjust if userId is stored differently
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
      const res = await axios.post(
        "http://localhost:3000/api/courses/checkout-session",
        { userId, courseId },
        config
      );
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Stripe session creation failed");
      }
    } catch (err) {
      toast.error("Payment error: " + (err.response?.data?.error || err.message));
    }
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const deletedQuery = filterStatus === "deleted" ? "true" : "false";
      const res = await axios.get(
        `http://localhost:3000/api/courses?deleted=${deletedQuery}`,
        config
      );
      setCourses(res.data || []); // backend returns courses array directly
    } catch (error) {
      toast.error("Failed to load courses");
    }
    setLoading(false);
  }, [filterStatus, config]);

  useEffect(() => {
    fetchCourses();
    setCurrentPage(1);
  }, [fetchCourses]);

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

  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPage = (page) => setCurrentPage(page);

  // Delete handler (soft delete)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This course will be marked as deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/courses/${id}`, config);
        toast.success("Course deleted");
        fetchCourses();
      } catch {
        toast.error("Failed to delete course");
      }
    }
  };

  // Restore deleted course
  const handleRestore = async (id) => {
    const result = await Swal.fire({
      title: "Restore Course?",
      text: "This course will be visible again.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Restore",
    });
    if (result.isConfirmed) {
      try {
        await axios.post(`http://localhost:3000/api/courses/restore/${id}`, {}, config);
        toast.success("Course restored");
        fetchCourses();
      } catch {
        toast.error("Failed to restore course");
      }
    }
  };

  // Edit handler with Swal modal + image upload + update
  const handleEdit = (course) => {
    let selectedFile = null;
    let imagePreviewUrl = course.imageUrl || "https://via.placeholder.com/400x200?text=No+Image";
    const topics = ["Organic", "Irrigation", "Soil", "Composting"];

    MySwal.fire({
      title: `<span style="font-size:22px;color:#166534;">✏️ Edit Course: <strong>${course.title}</strong></span>`,
      html: `
        <div style="text-align: left; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <label style="font-weight:bold; margin-top: 10px;">Current Image</label><br/>
          <img id="imgPreview" src="${imagePreviewUrl}" alt="Course Image" 
               style="width:100%; max-height:200px; object-fit:cover; margin-bottom: 10px; border-radius:8px;" />
          <label style="font-weight:bold;">Change Image</label><br/>
          <input type="file" id="imageInput" accept="image/*" style="margin-bottom: 15px; width: 100%;" />
          <label style="font-weight:bold;">Title</label>
          <input id="title" class="swal2-input" style="width:100%;" value="${course.title}" />
          <label style="font-weight:bold;">Description</label>
          <textarea id="description" class="swal2-textarea" rows="3" style="width:100%;">${course.description}</textarea>
          <div style="display:flex; gap: 10px;">
            <div style="flex:1;">
              <label style="font-weight:bold;">Start Date</label>
              <input id="startingdate" type="date" class="swal2-input" value="${course.startingdate}" />
            </div>
            <div style="flex:1;">
              <label style="font-weight:bold;">End Date</label>
              <input id="enddate" type="date" class="swal2-input" value="${course.enddate}" />
            </div>
          </div>
          <label style="font-weight:bold;">Course Fee (Rs)</label>
          <input id="coursefee" type="number" class="swal2-input" value="${course.coursefee}" />
          <label style="font-weight:bold;">Coordinator</label>
          <input id="coordinator" class="swal2-input" value="${course.coordinator}" />
          <label style="font-weight:bold;">Topics</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px;">
            ${topics
              .map(
                (topic) =>
                  `<span style="background-color:#34d399; color:white; padding:3px 8px; margin:2px; border-radius:9999px; font-size:0.85rem;">${topic}</span>`
              )
              .join("")}
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "💾 Update Course",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const inputFile = document.getElementById("imageInput");
        const imgPreview = document.getElementById("imgPreview");
        inputFile.addEventListener("change", (e) => {
          selectedFile = e.target.files[0];
          if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
              imgPreview.src = event.target.result;
            };
            reader.readAsDataURL(selectedFile);
          }
        });
      },
      preConfirm: async () => {
        const updatedData = {
          title: document.getElementById("title").value.trim(),
          description: document.getElementById("description").value.trim(),
          startingdate: document.getElementById("startingdate").value,
          enddate: document.getElementById("enddate").value,
          coursefee: document.getElementById("coursefee").value,
          coordinator: document.getElementById("coordinator").value.trim(),
        };

        try {
          if (selectedFile) {
            const formData = new FormData();
            formData.append("image", selectedFile);
            const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
              headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
            });
            updatedData.imageUrl = uploadRes.data.imageUrl;
          }

          await axios.put(`http://localhost:3000/api/courses/${course._id}`, updatedData, config);
          toast.success("Course updated successfully");
          await fetchCourses();
        } catch (err) {
          toast.error("Update failed: " + (err.response?.data?.error || err.message));
          throw err; // keep Swal open on error
        }
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by title or coordinator..."
          className="w-full sm:w-1/3 rounded-full border border-green-300 px-4 py-2 pl-10 text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Search courses"
        />
        <select
          className="w-full sm:w-1/5 rounded-full border border-green-300 px-4 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
          value={priceFilter}
          onChange={(e) => {
            setPriceFilter(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter courses by price"
        >
          <option value="all">💰 All Prices</option>
          <option value="below20k">Below Rs. 20,000</option>
          <option value="above20k">Rs. 20,000 and above</option>
        </select>
        <select
          className="w-full sm:w-1/5 rounded-full border border-green-300 px-4 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter courses by status"
        >
          <option value="active">✅ Active Courses</option>
          <option value="deleted">🗑️ Deleted Courses</option>
        </select>
      </div>

      {/* Heading */}
      <h2 className="text-4xl heading-font font-semibold text-green-800 mb-6">
        {filterStatus === "deleted"
          ? "🗑️ Deleted Courses"
          : "🌿 Active Agriculture Courses"}
      </h2>

      {/* Loading or no courses message */}
      {loading ? (
        <p className="text-center text-green-600 font-semibold">Loading...</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-gray-500 italic text-center col-span-full">
          No matching courses found.
        </p>
      ) : (
        <>
          {/* Courses grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white border rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-xl heading-font text-green-700 font-semibold mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {course.description}
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1 mb-4">
                    <li>
                      <strong>Fee:</strong> Rs. {course.coursefee}
                    </li>
                    <li>
                      <strong>Dates:</strong> {course.startingdate} → {course.enddate}
                    </li>
                    <li>
                      <strong>Coordinator:</strong> {course.coordinator}
                    </li>
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {!course.deleted ? (
                      <>
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg"
                        >
                          Delete
                        </button>
                        {/* Stripe payment button for Agriculture Inspector course */}
                        {course.title.toLowerCase().includes("agriculture inspector") && (
                          <button
                            onClick={() => handleStripePayment(course._id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-lg"
                          >
                            Pay with Stripe
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(course._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1.5 rounded-lg"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded-full font-semibold border transition ${
                    isActive
                      ? "bg-green-700 text-white border-green-700"
                      : "text-green-700 border-green-300 hover:bg-green-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
