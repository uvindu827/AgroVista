import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NFPost from './NFPost';
import { useNavigate } from 'react-router-dom';

function NFManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/newsFeed/getAllPosts');
        setPosts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = () => {
    navigate('/add-post');
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/newsFeed/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete post');
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/update_post/${postId}`);
  };

  const handleReportedPosts = () => {
    navigate('/report_list');
  };

  if (loading) return <div className="text-center p-8 text-lg text-green-600">Loading posts...</div>;
  if (error) return <div className="text-center p-8 text-lg text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-green-700 mb-10">
          News Feed Management
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={handleAddPost}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white hover:bg-green-700 transition shadow-md"
          >
            ➕ Add New Post
          </button>

          <button
            onClick={handleReportedPosts}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-3 text-base font-semibold text-white hover:bg-rose-700 transition shadow-md"
          >
            🚩 View Reported Posts
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <NFPost
                key={post.id}
                post={post}
                onDeletePost={() => handleDeletePost(post.id)}
                onEditPost={() => handleEditPost(post.id)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 text-xl">
              No posts available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NFManagement;
