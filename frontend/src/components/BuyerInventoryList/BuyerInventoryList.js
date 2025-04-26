import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BuyerInventoryList() {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const navigate = useNavigate();
  const { buyerId } = useParams();
  const location = useLocation();
  const customerId = location.state?.customerId || localStorage.getItem('ID');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const defaultImage = 'https://media.istockphoto.com/id/1128687123/photo/shopping-bag-full-of-fresh-vegetables-and-fruits.jpg?s=2048x2048&w=is&k=20&c=0JBSwrIo2X2Xj9eCyb0cVTF3DGFosHExsun8wvEtjAM=';

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token || !customerId || !buyerId) {
          toast.error('Authentication or buyer selection required', {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/api/inventory`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sortBy,
            order: sortOrder,
            buyerID: buyerId,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            search: searchQuery || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { inventories, totalPages: total, currentPage: page } = response.data;
        setInventoryData(inventories || []);
        setTotalPages(total || 0);
        setCurrentPage(page || 1);
      } catch (error) {
        console.error('Error fetching buyer inventory:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
        toast.error(error.response?.data?.error || 'Error fetching buyer inventory', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [currentPage, itemsPerPage, sortBy, sortOrder, selectedCategory, searchQuery, buyerId, customerId, navigate]);

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !customerId || !buyerId) {
        toast.error('Authentication required', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/login');
        return;
      }

      // Fetch current cart
      let currentCart = { products: [] };
      try {
        const cartResponse = await axios.get(
          `${API_URL}/api/cart/${encodeURIComponent(customerId)}/${encodeURIComponent(buyerId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        currentCart = cartResponse.data;
      } catch (error) {
        if (error.response?.status !== 404) {
          throw error; // Rethrow non-404 errors
        }
        // Cart not found (404) is okay; proceed with empty cart
      }

      // Check if item exists in cart
      const existingProduct = currentCart.products.find(
        (p) => p.productId.toString() === item._id
      );
      const updatedProducts = [...currentCart.products];

      if (existingProduct) {
        // Update quantity
        updatedProducts.forEach((p) => {
          if (p.productId.toString() === item._id) {
            p.quantity += 1;
          }
        });
      } else {
        // Add new item
        updatedProducts.push({
          productId: item._id,
          quantity: 1,
        });
      }

      // Update cart in backend
      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          customerId,
          buyerId,
          products: updatedProducts,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`${item.productName} added to cart`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.error || 'Error adding to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleBuy = (item) => {
    navigate(`/checkout/${item._id}`, {
      state: { customerId, buyerId, item: { id: item._id, productName: item.productName, price: item.price } },
    });
  };

  const handleViewCart = () => {
    navigate('/cart', { state: { customerId, buyerId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-extrabold text-green-900 text-center">Product List</h2>
          <button
            onClick={handleViewCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
            aria-label="View cart"
          >
            View Cart
          </button>
        </div>

        <div className="mb-10 flex gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
              placeholder="Search by product name"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search products"
            />
          </div>
          <select
            className="border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-700"
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            <option value="Rice">Rice</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Grains">Grains</option>
            <option value="Dairy">Dairy</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-6 flex gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => handleSort('productName')}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            Sort by Name {sortBy === 'productName' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('price')}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            Sort by Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg font-medium">Loading...</p>
          </div>
        ) : inventoryData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg font-medium">No products found for this buyer.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryData.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={item.productPicture || defaultImage}
                      alt={item.productName}
                      className="w-full h-32 object-cover"
                      onError={(e) => (e.target.src = defaultImage)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.productName}</h3>
                    <p className="text-gray-600 text-xs mb-1">Price: ${item.price} per KG</p>
                    <p className="text-gray-600 text-xs mb-1">Stock: {item.stock} KG</p>
                    <p className="text-gray-600 text-xs mb-1">
                      Manufacture: {new Date(item.manufactureDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-xs mb-1">
                      Expiration: {new Date(item.expirationDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-xs mb-3">Category: {item.category}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-green-600 text-white px-20 py-2 text-sm rounded-md hover:bg-green-700 transition-all duration-200"
                        aria-label={`Add ${item.productName} to cart`}
                      >
                        Add to Cart
                      </button>
                      {/*<button
                        onClick={() => handleBuy(item)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-700 transition-all duration-200"
                        aria-label={`Buy ${item.productName}`}
                      >
                        Buy
                      </button>*/}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 bg-white rounded-xl shadow-sm p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-all duration-200"
                aria-label="Previous page"
              >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-all duration-200"
                aria-label="Next page"
              >
                Next
                <svg className="h-5 w-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default BuyerInventoryList;