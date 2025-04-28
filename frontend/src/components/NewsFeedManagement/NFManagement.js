import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NFPost from './NFPost';
import { useNavigate } from 'react-router-dom';
import { Plus, Flag, ArrowLeft } from 'lucide-react';

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

  const handleBackToDashboard = () => {
    navigate('/users_management');
  };

  const handleAddPost = () => {
    navigate('/add-post');
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    // Show loading toast
    const loadingToastId = toast.loading('Deleting post...');

    try {
      await axios.delete(`http://localhost:3000/api/newsFeed/${postId}`);
      // Update local state to remove the deleted post
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      
      // Replace loading toast with success toast
      toast.success('Post deleted successfully!', { id: loadingToastId });
    } catch (err) {
      console.error('Delete failed:', err);
      // Replace loading toast with error toast
      toast.error(err.response?.data?.message || 'Failed to delete post', { id: loadingToastId });
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
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 text-white p-6 flex flex-col gap-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBackToDashboard}
            className="p-2 mr-2 rounded-full hover:bg-green-600 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-2xl font-bold">News Feed</div>
        </div>
        
        <button
          onClick={handleAddPost}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white hover:bg-green-800 transition shadow-md w-full"
        >
          <Plus size={20} />
          <span>Add New Post</span>
        </button>

        <button
          onClick={handleReportedPosts}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-3 text-base font-semibold text-white hover:bg-rose-700 transition shadow-md w-full"
        >
          <Flag size={20} />
          <span>Reported Posts</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-green-700">
              News Feed Management
            </h1>
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
    </div>
  );
}

export default NFManagement;