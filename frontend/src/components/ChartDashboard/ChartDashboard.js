import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar';  

ChartJS.register(ArcElement, Tooltip, Legend);  

function ChartDashboard() { 
  const [inventoryData, setInventoryData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 
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
            buyerID, 
            category: selectedCategory !== 'All' ? selectedCategory : undefined, 
            search: searchQuery || undefined 
          }, 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }); 

        setInventoryData(response.data.inventories); 
      } catch (error) { 
        console.error('Error fetching inventory:', error); 
        toast.error(error.response?.data?.message || 'Error fetching inventory'); 
      } finally { 
        setIsLoading(false); 
      } 
    }; 

    fetchInventory(); 
  }, [selectedCategory, searchQuery, navigate]); 

  // Handle search 
  const handleSearch = (e) => { 
    setSearchQuery(e.target.value); 
  }; 

  // Handle category change 
  const handleCategoryChange = (e) => { 
    setSelectedCategory(e.target.value); 
  }; 

  // Create data for the pie chart based on total stock 
  const getTotalStockData = () => { 
    const productNames = inventoryData.map(item => item.productName); 
    const stock = inventoryData.map(item => item.stock); 

    return { 
      labels: productNames, 
      datasets: [{ 
        data: stock, 
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'], 
      }] 
    }; 
  }; 

  // Create data for the pie chart based on expiration dates 
  const getExpirationDateData = () => { 
    const expiringSoon = inventoryData.filter(item => { 
      const expirationDate = new Date(item.expirationDate); 
      const today = new Date(); 
      const diffInDays = (expirationDate - today) / (1000 * 3600 * 24); 
      return diffInDays <= 30;  // Expiring in the next 30 days 
    }).length; 

    const expiringInThreeMonths = inventoryData.filter(item => { 
      const expirationDate = new Date(item.expirationDate); 
      const today = new Date(); 
      const diffInDays = (expirationDate - today) / (1000 * 3600 * 24); 
      return diffInDays > 30 && diffInDays <= 90;  // Expiring in the next 3 months 
    }).length; 

    const expiringLater = inventoryData.filter(item => { 
      const expirationDate = new Date(item.expirationDate); 
      const today = new Date(); 
      const diffInDays = (expirationDate - today) / (1000 * 3600 * 24); 
      return diffInDays > 90;  // Expiring later 
    }).length; 

    return { 
      labels: ['Expiring Soon (<= 30 days)', 'Expiring in 3 Months (31-90 days)', 'Expiring Later (> 90 days)'], 
      datasets: [{ 
        data: [expiringSoon, expiringInThreeMonths, expiringLater], 
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], 
      }] 
    }; 
  }; 

  // Create data for the pie chart based on manufacture dates 
  const getManufactureDateData = () => { 
    const manufacturedInLastSixMonths = inventoryData.filter(item => { 
      const manufactureDate = new Date(item.manufactureDate); 
      const today = new Date(); 
      const diffInMonths = (today.getFullYear() - manufactureDate.getFullYear()) * 12 + today.getMonth() - manufactureDate.getMonth(); 
      return diffInMonths <= 6;  // Manufactured in the last 6 months 
    }).length; 

    const manufacturedInLastYear = inventoryData.filter(item => { 
      const manufactureDate = new Date(item.manufactureDate); 
      const today = new Date(); 
      const diffInMonths = (today.getFullYear() - manufactureDate.getFullYear()) * 12 + today.getMonth() - manufactureDate.getMonth(); 
      return diffInMonths > 6 && diffInMonths <= 12;  // Manufactured in the last year 
    }).length; 

    const manufacturedEarlier = inventoryData.filter(item => { 
      const manufactureDate = new Date(item.manufactureDate); 
      const today = new Date(); 
      const diffInMonths = (today.getFullYear() - manufactureDate.getFullYear()) * 12 + today.getMonth() - manufactureDate.getMonth(); 
      return diffInMonths > 12;  // Manufactured earlier than 1 year ago 
    }).length; 

    return { 
      labels: ['Manufactured in Last 6 Months', 'Manufactured in Last Year', 'Manufactured Earlier'], 
      datasets: [{ 
        data: [manufacturedInLastSixMonths, manufacturedInLastYear, manufacturedEarlier], 
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], 
      }] 
    }; 
  }; 

  // Create data for the pie chart based on product categories 
  const getCategoryData = () => { 
    const categories = inventoryData.map(item => item.category); 
    const categoryCounts = categories.reduce((acc, category) => { 
      acc[category] = (acc[category] || 0) + 1; 
      return acc; 
    }, {}); 

    return { 
      labels: Object.keys(categoryCounts), 
      datasets: [{ 
        data: Object.values(categoryCounts), 
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'], 
      }] 
    }; 
  }; 

  return ( 
    <div className="flex h-screen bg-gradient-to-b from-green-400"> 
      <BuyerNavBar /> 
      <div className="flex-1 p-6"> 
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

        <br />

        {/* Horizontal Layout for Pie Charts */}
        <div className="mb-4 flex gap-6 justify-between">
          <div className="chart-container" style={{ width: '33%', height: '230px' }}> 
            <h3 className="text-xl font-semibold text-center">Total Stock Distribution</h3> 
            <Pie data={getTotalStockData()} /> 
          </div>

          <div className="chart-container" style={{ width: '33%', height: '240px' }}> 
            <h3 className="text-xl font-semibold text-center">Expiration Dates Distribution</h3> 
            <Pie data={getExpirationDateData()} /> 
          </div>

          <div className="chart-container" style={{ width: '33%', height: '240px' }}> 
            <h3 className="text-xl font-semibold text-center">Manufacture Dates Distribution</h3> 
            <Pie data={getManufactureDateData()} /> 
          </div>
        </div> <br /><br />

        {/* Product Categories Pie Chart */}
        <div className="mb-4 flex justify-center">
          <div className="chart-container" style={{ width: '200px', height: '220px' }}> 
            <h3 className="text-xl font-semibold text-center">Product Categories Distribution</h3> 
            <Pie data={getCategoryData()} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                  legend: { 
                    position: 'top', 
                  }, 
                }, 
              }} 
            /> 
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? ( 
          <div className="text-center py-4">Loading...</div> 
        ) : ( 
          <ToastContainer /> 
        )} 
      </div> 
    </div> 
  ); 
}

export default ChartDashboard;
