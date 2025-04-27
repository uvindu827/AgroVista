import React from "react";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/postDetails/${post.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-700 transform hover:scale-105"
    >
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-3xl font-semibold text-white mb-2">{post.title}</h2>
        {post.description && (
          <p className="text-gray-700 text-sm mb-3">{post.description}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2 text-xs">
            {post.tags && post.tags.length > 0 && (
              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full">
                {post.tags[0]}
              </span>
            )}
          </div>

          <div className="flex items-center text-yellow-400 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {post.date || "Apr 15"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
