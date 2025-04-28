import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar';

function BuyerManageProducts() {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const buyerID = localStorage.getItem('ID');

        if (!token || !buyerID) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/inventory`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sortBy,
            order: sortOrder,
            buyerID,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            search: searchQuery || undefined
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { inventories, totalPages: total, currentPage: page } = response.data;
        setInventoryData(inventories);
        setTotalPages(total);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error(error.response?.data?.message || 'Error fetching inventory');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [currentPage, itemsPerPage, sortBy, sortOrder, selectedCategory, searchQuery, navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Product deleted successfully');
      setInventoryData(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Error deleting product');
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  const handleEdit = (id) => {
    navigate(`/update-product/${id}`);
  };

  // Generate PDF report
  const generatePDF = () => {
    const input = document.getElementById('inventory-table');
    // Temporarily hide the Actions column for PDF
    const actionsColumn = input.querySelectorAll('th:last-child, td:last-child');
    actionsColumn.forEach(element => {
      element.style.display = 'none';
    });

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      // Restore the Actions column visibility
      actionsColumn.forEach(element => {
        element.style.display = '';
      });

      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      // Add header background
      doc.setFillColor(34, 139, 34); // Forest green
      doc.rect(0, 0, pageWidth, 30, 'F');

      // Add header text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255); // White text
      doc.text('AgroVista Inventory Report', margin, 20);

      // Add company details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('AgroVista Enterprises', pageWidth - margin - 50, 15);
      doc.text('123 Agriculture St, Farm City', pageWidth - margin - 50, 22);

      // Add generation date
      doc.setTextColor(200, 200, 200);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 40);

      // Add horizontal line separator
      doc.setDrawColor(34, 139, 34);
      doc.setLineWidth(0.5);
      doc.line(margin, 45, pageWidth - margin, 45);

      // Add table image
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const tableY = 50;
      doc.addImage(imgData, 'PNG', margin, tableY, imgWidth, imgHeight);

      // Add footer
      doc.setFillColor(34, 139, 34);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Generated by AgroVista System - Empowering Agriculture', margin, pageHeight - 5);
      doc.text(`Page 1 of 1`, pageWidth - margin - 20, pageHeight - 5);

      // Save the PDF
      doc.save('AgroVista_Inventory_Report.pdf');
    });
  };

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-green-200">
      <BuyerNavBar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Manage Products</h2>

        {/* Search and Filter Controls */}
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            className="border px-4 py-2 rounded flex-1"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <select
            className="border px-4 py-2 rounded"
            value={selectedCategory}
            onChange={handleCategoryChange}
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

        {/* Generate Report Button */}
        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Generate PDF Report
        </button>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {/* Inventory Table */}
            <table id="inventory-table" className="min-w-full bg-white shadow-md rounded-lg">
              <thead>   
                <tr>
                  <th 
                    className="py-2 px-4 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('productName')}
                  >
                    Product Name {sortBy === 'productName' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="py-2 px-4 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('price')}
                  >
                    Price (per KG) {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b">Stock (KG)</th>
                  <th className="py-2 px-4 border-b">Manufacture Date</th>
                  <th className="py-2 px-4 border-b">Expiration Date</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map(item => (
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
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default BuyerManageProducts;