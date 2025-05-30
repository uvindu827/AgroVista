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

  const handleAddPost =() => {
    navigate('/add-post');
  };

  const handleDeletePost = async( postId ) => {
    if(!window.confirm('Are you sure you want to delete this post?'))
      return;

    try{
      await axios.delete(`http://localhost:3000/api/newsFeed/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }catch(err){
      console.error('Delete failed:', err);
      setError('Failed to delete post');
    }
  }

  const handleEditPost = (postId) => {
    navigate(`/update_post/${postId}`);

  }

  const handleReportedPosts = (postId) => {
    navigate('/report_list');

  }


  if (loading) return <div className="text-center p-8 text-lg text-red-600">Loading posts...</div>;
  if (error) return <div className="text-center p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-8">
          News Feed Management
        </h1>
        <div className="flex justify-end">
          <button
            onClick={handleAddPost}
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Post
          </button>
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleReportedPosts}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Reported Posts
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {posts.map((post) => (
            <NFPost 
            key={post.id} 
            post={post}
            onDeletePost = {() => handleDeletePost(post.id)}
            onEditPost = {() => handleEditPost(post.id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NFManagement;
