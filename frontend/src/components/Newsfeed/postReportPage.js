import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostReportPage = () => {
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/newsFeed/post/report",
        {
          postID: postId,
          reason: inputs.reason,
        }
      );

      if (response.status === 201) {
        toast.success("Post reported successfully!");
        setInputs({ reason: "" });
        setTimeout(() => navigate("/newsfeed"), 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to report the post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-green-200 min-h-screen flex flex-col">
      {/* Header - Matched with page background color */}
      <header className="bg-green-200 text-green-800 py-5 sticky top-0 z-10 border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Report Post
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          <div className="bg-yellow-50 p-6 border-b border-yellow-200">
            <h2 className="text-2xl font-bold text-green-800 text-center">
              Report Content
            </h2>
            <p className="text-gray-700 text-center mt-2">
              Please provide a reason for reporting this post. Your report will
              be reviewed by our team.
            </p>
          </div>

          <div className="p-6">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-green-800"
                >
                  Reason for Reporting <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={inputs.reason}
                  onChange={handleChange}
                  placeholder="Please explain why you are reporting this post. Include specific details that violate our community guidelines."
                  rows="6"
                  required
                  disabled={isLoading}
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-xs text-gray-500 text-center">
                  Your report will remain anonymous. We take all reports
                  seriously and will review this content.
                </p>
              </div>

              <div className="flex gap-4 pt-2 justify-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !inputs.reason.trim()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-100 py-4 border-t border-green-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-green-800 text-sm">
          Thank you for helping keep our community safe and respectful.
        </div>
      </footer>
    </div>
  );
};

export default PostReportPage;
