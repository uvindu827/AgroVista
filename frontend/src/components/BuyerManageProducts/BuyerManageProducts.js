import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar';

function BuyerManageProducts() {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust the number of items per page

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/inventory');
        const data = await response.json();
        setInventoryData(data.inventories);  // Assuming response has 'inventories' key
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  // Filtered inventory data based on search and category
  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/inventory/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Product deleted successfully');
        setInventoryData(inventoryData.filter(item => item._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Server error.');
    }
  };

  // Handle edit action to navigate to the update page
  const handleEdit = (id) => {
    navigate(`/update-product/${id}`); // Navigate to update product page with product ID
  };

  return (
    <div className="flex">
      <BuyerNavBar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Manage Products</h2>

        {/* Search and Category Filter */}
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            className="border px-4 py-2 rounded w-1/2"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Grains">Grains</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Inventory Table */}
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product Name</th>
              <th className="py-2 px-4 border-b">Price (per KG)</th>
              <th className="py-2 px-4 border-b">Stock (KG)</th>
              <th className="py-2 px-4 border-b">Manufacture Date</th>
              <th className="py-2 px-4 border-b">Expiration Date</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b">{item.productName}</td>
                <td className="py-2 px-4 border-b">{item.price}</td>
                <td className="py-2 px-4 border-b">{item.stock}</td>
                <td className="py-2 px-4 border-b">{item.manufactureDate}</td>
                <td className="py-2 px-4 border-b">{item.expirationDate}</td>
                <td className="py-2 px-4 border-b">{item.category}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyerManageProducts;
