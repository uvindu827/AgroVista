import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NFPost from './NFPost';
import { useNavigate } from 'react-router-dom';

function NFManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
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

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setSearchError('Please enter a post ID');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    
    try {
      const response = await axios.get(`http://localhost:3000/api/newsFeed/${searchId}/getPostById`);
      const foundPost = response.data.data;
      
      setPosts([foundPost]);
      setSearchLoading(false);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError(err.response?.data?.message || 'Failed to find post with this ID');
      setSearchLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchId('');
    setSearchError('');
    
    // Reset to show all posts
    setLoading(true);
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

        {/* Search Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by Post ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {searchError && (
                <p className="text-red-500 text-sm mt-1">{searchError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Clear
              </button>
            </div>
          </form>
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