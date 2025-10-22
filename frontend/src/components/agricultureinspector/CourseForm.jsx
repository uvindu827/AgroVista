import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const cleanInput = (value) => value.replace(/[^a-zA-Z0-9 ]/g, "");
const formatDate = (date) => date.toISOString().split("T")[0];

const today = new Date();
const minStartDate = new Date(today);
minStartDate.setDate(today.getDate() + 1);

const minEndDate = new Date(today);
minEndDate.setDate(today.getDate() + 21);

export default function CourseForm({ initialData = null, onSuccess, onCancel }) {
  // Creative agriculture-themed background
  const backgroundUrl = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80"; // Agriculture field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingdate, setStartingdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [coursefee, setCoursefee] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStartingdate(initialData.startingdate || "");
      setEnddate(initialData.enddate || "");
      setCoursefee(initialData.coursefee || "");
      setCoordinator(initialData.coordinator || "");
      setImagePreview(initialData.imageUrl || "");
      setImageFile(null);
    } else {
      setTitle("");
      setDescription("");
      setStartingdate("");
      setEnddate("");
      setCoursefee("");
      setCoordinator("");
      setImagePreview("");
      setImageFile(null);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const selectedStart = new Date(startingdate);
    const selectedEnd = new Date(enddate);

    if (selectedStart < minStartDate) {
      toast.error("Start date must be at least 1 day after today");
      setUploading(false);
      return;
    }

    if (selectedEnd < minEndDate) {
      toast.error("End date must be at least 3 weeks after today");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("startingdate", startingdate);
      formData.append("enddate", enddate);
      formData.append("coursefee", coursefee);
      formData.append("coordinator", coordinator);
      if (imageFile) formData.append("image", imageFile);

      if (initialData) {
        await axios.put(
          `http://localhost:3000/api/courses/${initialData._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        await MySwal.fire({
          icon: "success",
          title: "Updated!",
          text: "Course updated successfully",
          confirmButtonColor: "#22c55e",
        });
      } else {
        await axios.post("http://localhost:3000/api/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await MySwal.fire({
          icon: "success",
          title: "Created!",
          text: "Course created successfully",
          confirmButtonColor: "#22c55e",
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save course");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={backgroundUrl}
          alt="Agriculture Field"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(56,178,172,0.18) 0%, rgba(34,197,94,0.18) 100%)",
          }}
        ></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-green-50 via-white to-green-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-green-200"
        style={{ position: "relative", zIndex: 2 }}
      >
        <h2 className="text-2xl font-extrabold text-green-700 mb-6 text-center">
          {initialData ? "Edit Course" : "Add New Course"}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(cleanInput(e.target.value))}
            placeholder="Title"
            required
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Course Description"
            rows={3}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
          />
          <input
            type="date"
            value={startingdate}
            onChange={(e) => setStartingdate(e.target.value)}
            required
            min={formatDate(minStartDate)}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
          />
          <input
            type="date"
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
            required
            min={formatDate(minEndDate)}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
          />
          <input
            type="number"
            value={coursefee}
            onChange={(e) => setCoursefee(e.target.value)}
            required
            placeholder="Course Fee"
            min="0"
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
          />
          <input
            type="text"
            value={coordinator}
            onChange={(e) => setCoordinator(cleanInput(e.target.value))}
            required
            placeholder="Coordinator Name"
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Course Preview"
                className="w-full h-48 object-cover rounded-lg shadow border mt-1"
              />
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8 space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="px-6 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white font-semibold transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300 ease-in-out"
          >
            {uploading ? "Uploading..." : initialData ? "Update Course" : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
