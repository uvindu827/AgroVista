import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    image: "",
    keywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("content", inputs.content);
      formData.append("image", inputs.image);
      formData.append("keywords", JSON.stringify(
        inputs.keywords.split(',').map(k => k.trim()).filter(k => k)
      ));

      const response = await axios.post('http://localhost:3000/api/newsFeed/addPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccess('Post created successfully!');
        setInputs({
          title: '',
          content: '',
          image: null,
          keywords: '',
        });
      }
      navigate("/nf-management");
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-green-200">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            Create New Post
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-green-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-green-700">
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  required
                  value={inputs.content}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-green-300 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-green-700">
                Image
              </label>
              <div className="mt-1">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setInputs({ ...inputs, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border border-green-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-green-700">
                Keywords (comma-separated)
              </label>
              <div className="mt-1">
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  value={inputs.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 transition-colors duration-200"
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPost;