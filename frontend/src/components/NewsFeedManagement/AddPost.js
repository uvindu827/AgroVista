import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    image: null,
    keywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateInputs = () => {
    const errors = {};
    
    // Image validation
    if (inputs.image) {
      // Check file format
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!acceptedFormats.includes(inputs.image.type)) {
        errors.image = "Image must be in JPG, PNG, JPEG format";
      }
      
      if (inputs.image.size > 5 * 1024 * 1024) {
        errors.image = "Image size must be less than 5MB";
      }
    }
    
    // Keywords validation - only letters, spaces, and commas
    if (!/^[A-Za-z\s,]+$/.test(inputs.keywords)) {
      errors.keywords = "Keywords can only contain letters, spaces, and commas";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate inputs before submission
    if (!validateInputs()) {
      setLoading(false);
      return;
    }

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
    
    // Clear validation error when field is edited
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setInputs({
      ...inputs,
      image: file,
    });
    
    // Clear validation error when image is changed
    if (validationErrors.image) {
      setValidationErrors({
        ...validationErrors,
        image: ''
      });
    }
  };

  const handleCancel = () => {
    navigate("/nf-management");
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
                  className={`w-full px-4 py-2 border ${validationErrors.title ? 'border-red-300' : 'border-green-300'} rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                )}
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
                Image (JPG, PNG, JPEG)
              </label>
              <div className="mt-1">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  required
                  onChange={handleImageChange}
                  className={`w-full px-4 py-2 border ${validationErrors.image ? 'border-red-300' : 'border-green-300'} rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100`}
                />
                {validationErrors.image && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-green-700">
                Keywords (comma-separated, letters only)
              </label>
              <div className="mt-1">
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  value={inputs.keywords}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${validationErrors.keywords ? 'border-red-300' : 'border-green-300'} rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
                {validationErrors.keywords && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.keywords}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 transition-colors duration-200"
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