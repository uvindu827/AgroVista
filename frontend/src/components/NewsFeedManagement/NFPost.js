import React from "react";

function NFPost({ post, onDeletePost, onEditPost }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out overflow-hidden hover:-translate-y-1">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover border-b-4 border-blue-500"
          loading="lazy"
        />
      )}

      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{post.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Created at -{new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Updated at -{new Date(post.updatedAt).toLocaleDateString()}
        </p>

        <div className="flex justify-end items-center">
          <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full font-bold flex items-center space-x-1">
            <span>▲</span>
            <span>{post.upvoteCount}</span>
          </div>
        </div>
        <button
          onClick={onEditPost}
          className="text-yellow-500 hover:text-yellow-900 mr-4"
        >
          Edit post
        </button>
        <button
          onClick={onDeletePost}
          className="text-red-500 hover:text-red-900"
        >
          Delete post
        </button>
      </div>
    </div>
  );
}

export default NFPost;
