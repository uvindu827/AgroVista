import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateNFPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    keywords: [],
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/newsFeed/${id}/getPostById`);
        setFormData(res.data.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const validateInputs = () => {
    const errors = {};
    
    // Image validation (only for new uploads)
    if (formData.image && formData.image instanceof File) {
      // Check file format
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!acceptedFormats.includes(formData.image.type)) {
        errors.image = "Image must be in JPG, PNG, GIF, WEBP, or SVG format";
      }
      
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (formData.image.size > 5 * 1024 * 1024) {
        errors.image = "Image size must be less than 5MB";
      }
    }
    
    // Keywords validation - only letters, spaces, and commas
    const keywordsString = Array.isArray(formData.keywords) ? formData.keywords.join(',') : formData.keywords;
    if (!/^[A-Za-z\s,]+$/.test(keywordsString)) {
      errors.keywords = "Keywords can only contain letters, spaces, and commas";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendRequest = async () => {
    setLoading(true);
    
    // Validate inputs before submission
    if (!validateInputs()) {
      setLoading(false);
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }
      
      const keywordArray = Array.isArray(formData.keywords)
        ? formData.keywords
        : formData.keywords.split(',').map(k => k.trim());
          
      keywordArray.forEach((keyword, index) => {
        formDataToSend.append(`keywords[${index}]`, keyword);
      });

      await axios.put(
        `http://localhost:3000/api/newsFeed/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate("/nf-management");
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  const handleCancel = () => {
    navigate("/nf-management");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "keywords") {
      const keywordArray = value.split(",").map(k => k.trim());
      setFormData({
        ...formData,
        keywords: keywordArray,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      
      // Clear validation error when image is changed
      if (validationErrors.image) {
        setValidationErrors({
          ...validationErrors,
          image: ''
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center tracking-tight">
          Update Post
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-green-800">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-green-50 border ${validationErrors.title ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-green-900 placeholder-green-400`}
              placeholder="Enter post title"
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-green-800">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-green-900 placeholder-green-400 resize-none"
              placeholder="Write your post content"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-green-800">
              Image (JPG, PNG, GIF, WEBP, SVG under 5MB)
            </label>
            <div className="relative">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleImageChange}
                className={`w-full px-4 py-3 bg-green-50 border ${validationErrors.image ? 'border-red-300' : 'border-green-200'} rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-green-900 file:font-medium hover:file:bg-yellow-300 transition-all duration-200 text-green-900`}
              />
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label htmlFor="keywords" className="block text-sm font-medium text-green-800">
              Keywords (comma-separated, letters only)
            </label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-green-50 border ${validationErrors.keywords ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-green-900 placeholder-green-400`}
              placeholder="e.g. news, tech, updates"
            />
            {validationErrors.keywords && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.keywords}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              Update Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateNFPost;