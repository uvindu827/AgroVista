import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PaymentDetails() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory, searchQuery]);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        },
      });

      const { inventories } = response.data;
      setInventoryData(inventories);
      setCurrentPage(1); // Reset to first page when inventory changes
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error(error.response?.data?.message || 'Error fetching inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product deleted successfully');
      setInventoryData(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Error deleting product');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Pagination handlers
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventoryData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <h2 className="text-2xl font-bold text-green-900 mb-6">Order Details</h2>

      {/* Search and Category Filter */}
      <div className="flex gap-4 mb-4">
        {/* Optional Search */}
        {/* <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded flex-1"
        /> */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border px-4 py-2 rounded"
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

      {/* Inventory Table */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b"> Date</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2 px-4 border-b">{item.price}</td>
                    <td className="py-2 px-4 border-b">{item.manufactureDate}</td>
                    <td className="py-2 px-4 border-b">{item.category}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Completed
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {inventoryData.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-green-900 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default PaymentDetails;
