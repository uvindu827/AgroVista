import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const customerId = location.state?.customerId || localStorage.getItem('ID');
  const defaultImage = 'https://img.freepik.com/free-vector/watercolor-farmers-market-illustration_23-2149346024.jpg?ga=GA1.1.2109057015.1744744570&semt=ais_hybrid&w=740';

  const fetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/users/buyers', {
        params: {
          page: currentPage,
          limit: 4,
          search: searchQuery,
        },
      });

      console.log('API Response:', response.data);
      const { buyers, pagination } = response.data.data || { buyers: [], pagination: {} };
      setBuyers(buyers || []);
      setTotalPages(pagination?.totalPages || 0);
    } catch (error) {
      console.error('Error fetching buyers:', error);
      toast.error('Failed to fetch buyers list', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          {/* Left section with Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Profile
          </button>

          {/* Center Title */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-green-900 sm:text-5xl animate-fade-in">
              Buyers List
            </h1>
            <p className="mt-3 text-lg text-green-800 animate-fade-in-up">
              Connect with our trusted buyers.
            </p>
          </div>

          {/* Right section with Logout button */}
          <button
            onClick={() => {
              localStorage.removeItem('ID');
              navigate('/');
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        <div className="relative mb-10 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search buyers by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search buyers"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="mt-4 h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-4 h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : buyers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg font-medium">No buyers found.</p>
            <p className="text-gray-400 mt-2">
              Try adjusting your search or check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {buyers.map((buyer) => (
                <div
                  key={buyer.buyerId || buyer._id || Math.random()}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  role="article"
                  aria-labelledby={`buyer-${buyer.buyerId || buyer._id || 'unknown'}`}
                >
                  <div className="relative">
                    <img
                      src={buyer.profilePicture || defaultImage}
                      alt={`${buyer.firstName || 'Unknown'} ${buyer.lastName || 'Buyer'}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3
                      id={`buyer-${buyer.buyerId || buyer._id || 'unknown'}`}
                      className="text-xl font-semibold text-gray-800 mb-2 truncate"
                    >
                      {buyer.firstName || buyer.email.split('@')[0] || 'Unknown'}{' '}
                      {buyer.lastName || 'Buyer'}
                    </h3>
                    <p
                      className="text-gray-600 text-sm mb-4 truncate"
                      title={buyer.email || 'No email'}
                    >
                      {buyer.email || 'No email available'}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/buyer/${buyer.buyerId || buyer._id}/inventory`, {
                          state: { customerId, buyerId: buyer.buyerId || buyer._id },
                        })
                      }
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      aria-label={`View inventory for ${buyer.firstName || 'Unknown'} ${buyer.lastName || 'Buyer'}`}
                      disabled={!buyer.buyerId && !buyer._id}
                    >
                      View Inventory
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-12 bg-white rounded-xl shadow-sm p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-all duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-all duration-200"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BuyersList;
