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

  const handleUpvotePost = (e) => {
    e.stopPropagation();
    console.log("Upvote clicked for post:", post.id);
  };

  const handleReportPost = (e) => {
    e.stopPropagation();
    navigate(`/postReport/${postId}`);
  };

  const handleSummarizePost = async () => {
    if (!post?.content || summarizing) return;
    
    setSummarizing(true);
    try {
      // Using the backend endpoint we just created
      const response = await fetch("http://localhost:3000/api/newsFeed/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: post.content
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        throw new Error(data.error || "No summary returned");
      }
    } catch (err) {
      console.error("Summarization failed:", err);
      setSummary("Failed to generate summary. Please try again later.");
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Post Details</h1>
      <div className="rounded-xl overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-60 object-cover"
        />
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Title:</h2>
        <p className="text-lg text-gray-800">{post?.title || "N/A"}</p>

        <h2 className="text-xl font-semibold text-gray-700">Content:</h2>
        <p className="text-gray-700 leading-relaxed">{post?.content || "N/A"}</p>

        {summary && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Summary:</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-gray-700 italic">{summary}</p>
            </div>
          </>
        )}

        <h2 className="text-xl font-semibold text-gray-700">Upvotes:</h2>
        <p className="text-gray-700">{post?.upvoteCount ?? "N/A"}</p>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleSummarizePost}
          disabled={summarizing}
          className={`bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300 shadow-md ${
            summarizing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {summarizing ? "Summarizing..." : "📝 Summarize"}
        </button>
        <button
          onClick={handleUpvotePost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300 shadow-md"
        >
          👍 Upvote
        </button>
        <button
          onClick={handleReportPost}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300 shadow-md"
        >
          🚩 Report
        </button>
      </div>
    </div>
  );
}

export default PostDetails;