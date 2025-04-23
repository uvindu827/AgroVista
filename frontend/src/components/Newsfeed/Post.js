import React from "react";

function Post({ post }) {

  const handleCardClick = () => {
    console.log("Post clicked:", post.id);
  }
  return (
    <div
    onClick={handleCardClick} 
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out overflow-hidden hover:-translate-y-1 flex flex-col cursor-pointer">
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

        <div className="flex justify-end items-center mt-auto">
          <div className="sm:ml-16 sm:flex-none">
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Upvote
            </button>
          </div>

          <div className="sm:ml-4 sm:flex-none">
            <button className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
