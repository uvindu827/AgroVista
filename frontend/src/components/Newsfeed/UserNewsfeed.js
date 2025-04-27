import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import NFPost from "./Post";

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
        console.error(err);
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
      console.error(err);
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

  if (loading) return <div className="text-center p-8 text-lg text-red-600">Loading posts...</div>;
  if (error) return <div className="text-center p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-6">
          News Feed
        </h1>
        

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Found {posts.length} results for "{searchTerm}"
            </p>
          )}
        </div>
        
        {/* Loading indicator for search */}
        {isSearching && (
          <div className="text-center p-4">
            <p className="text-blue-600">Searching...</p>
          </div>
        )}
        
        {/* Post grid */}
        {!isSearching && posts.length === 0 ? (
          <div className="text-center p-8 text-lg text-gray-600">
            No posts found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {posts.map((post) => (
              <NFPost 
                key={post.id} 
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserNewsfeed;