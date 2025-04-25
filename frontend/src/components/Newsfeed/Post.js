import React from "react";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("Post clicked:", post.id);
    navigate(`/postDetails/${post.id}`);
  };

  
  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out overflow-hidden hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover border-b-4 border-blue-500"
          loading="lazy"
        />
      )}

      <div className="p-6 flex flex-col flex-grow justify-between">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{post.title}</h2>
      </div>
    </div>
  );
}

export default Post;
