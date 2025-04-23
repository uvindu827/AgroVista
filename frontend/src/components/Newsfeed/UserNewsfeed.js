import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NFPost from "./Post";

function UserNewsfeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="text-center p-8 text-lg text-red-600">Loading posts...</div>;
  if (error) return <div className="text-center p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-8">
          News Feed
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {posts.map((post) => (
            <NFPost 
            key={post.id} 
            post={post}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserNewsfeed;
