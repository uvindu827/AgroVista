import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Post from './Post';

function UserNewsfeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/newsFeed/getAllPosts');
        setPosts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
      }
    };

    if (!searchTerm) {
      fetchPosts();
    }
  }, [searchTerm]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/newsFeed/admin/posts/search?search=${searchTerm}`);
      setPosts(response.data.data);
      setIsSearching(false);
    } catch (err) {
      setError('Failed to search posts');
      setIsSearching(false);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      }
    }, 500);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, handleSearch]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) return <div className="text-center p-8 text-lg text-green-600">Loading posts...</div>;
  if (error) return <div className="text-center p-8 text-lg text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold text-center text-white mb-6">
          News Feed
        </h1>

        <div className="mb-6 max-w-md mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-green-800"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 text-green-500 hover:text-green-700"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-green-600">
              Found {posts.length} results for "{searchTerm}"
            </p>
          )}
        </div>

        {isSearching && (
          <div className="text-center p-4">
            <p className="text-yellow-600">Searching...</p>
          </div>
        )}

        {!isSearching && posts.length === 0 ? (
          <div className="text-center p-8 text-lg text-gray-500">
            No posts found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserNewsfeed;
