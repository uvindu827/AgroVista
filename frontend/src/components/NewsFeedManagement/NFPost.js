import React from "react";

function NFPost({ post, onDeletePost, onEditPost }) {
  return (
    <div className="bg-amber-50 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden border border-green-300 flex flex-col">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover border-b-4 border-green-500"
          loading="lazy"
        />
      )}

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">{post.title}</h2>

          <p className="text-xs text-gray-500 mb-1">
            📅 Created: {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            🔄 Updated: {new Date(post.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={onEditPost}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={onDeletePost}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFPost;
