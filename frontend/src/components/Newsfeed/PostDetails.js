import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/newsFeed/${postId}/getPostById`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleReportPost = (e) => {
    e.stopPropagation();
    navigate(`/postReport/${postId}`);
  };

  const handleSummarizePost = async () => {
    if (!post?.content || summarizing) return;
    
    setSummarizing(true);
    try {
      console.log("Sending content for summarization:", post.content.substring(0, 100) + "...");
      
      const response = await fetch("http://localhost:3000/api/newsFeed/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: post.content
        })
      });
      
      const data = await response.json();
      console.log("Summarization response:", data);
      
      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        throw new Error(data.error || "No summary returned");
      }
    } catch (err) {
      console.error("Summarization failed:", err);
      setSummary(`Failed to generate summary: ${err.message}`);
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="text-center p-8 rounded-lg bg-white shadow-md">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-green-800">Loading post details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="text-center p-8 rounded-lg bg-white shadow-md border-l-4 border-red-500">
        <p className="text-xl text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-green-900 to-green-800 min-h-screen pb-12">
      {/* Header */}
      <header className="bg-green-900 py-5">
        <div className="max-w-4xl mx-auto px-4 items-center text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Post Details</h1>
        </div>
      </header>
  
      {/* Post Details Card */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white bg-opacity-60 backgrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-green-100">
          {/* Title Section */}
          <div className="p-6 md:p-8 bg-white bg-opacity-60 backgrop-blur-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800">{post?.title || "N/A"}</h2>
          </div>
  
          {/* Image Section */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={post?.image}
              alt={post?.title || "Post image"}
              className="w-full h-full object-cover"
            />
          </div>
  
          {/* Content Section */}
          <div className="p-6 md:p-8 mt-6"> {/* Added margin-top */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post?.content || "No content available"}</p>
            </div>
  
            {/* Summary Section */}
            {summary && (
              <div className="mt-8">
                <h3 className="flex items-center text-xl font-semibold text-green-800 mb-3">
                  <span className="mr-2">📝</span> Summary
                </h3>
                <div className="bg-white p-5 rounded-xl border border-yellow-200">
                  <p className="italic text-gray-700">{summary}</p>
                </div>
              </div>
            )}
  
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-8">
              <button
                onClick={handleSummarizePost}
                disabled={summarizing}
                className={`flex items-center bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition duration-300 shadow ${
                  summarizing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <span className="mr-2">📝</span>
                {summarizing ? "Summarizing..." : "Summarize"}
              </button>
              <button
                onClick={handleReportPost}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition duration-300 shadow"
              >
                <span className="mr-2">🚩</span>
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default PostDetails;