import React, { useState, useEffect } from 'react';
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar';


function BuyerAddProducts() {
  const [formData, setFormData] = useState({
    buyerID: '',
    productName: '',
    price: '',
    stock: '',
    expirationDate: '',
    manufactureDate: '',
    category: '',
    description: '',
    productPicture: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Retrieve user ID and token from localStorage
    const ID = localStorage.getItem("ID");
    const token = localStorage.getItem("token");

    if (token) {
      const encodedToken = btoa(token); // Encode the token for logging
      console.log("Encoded Token:", encodedToken);
    } else {
      console.error("Token not found in localStorage");
    }

    if (ID) {
      setFormData((prevData) => ({ ...prevData, buyerID: ID }));
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'productPicture') {
      setFormData({ ...formData, productPicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.productName || !formData.price || !formData.stock || !formData.expirationDate || !formData.manufactureDate || !formData.category) {
      setError('Please fill all required fields.');
      return;
    }

    setError(''); // Clear previous errors if any
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    
    try {
      const response = await fetch('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true); // Mark success
        setFormData({
          buyerID: formData.buyerID, // Retain buyerID
          productName: '',
          price: '',
          stock: '',
          expirationDate: '',
          manufactureDate: '',
          category: '',
          description: '',
          productPicture: null,
        });
      } else {
        setError(data.error || 'Failed to add product.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error, please try again later.');
    }
  };

  return (
    <div className="flex">
      <BuyerNavBar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Add New Product</h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">Product added successfully!</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
      
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full p-1.5 border rounded placeholder-green-600"
            placeholder="Product Name"
            required
          />

        

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-1.5 border rounded placeholder-green-600"
            placeholder="Price per KG"
            required
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-1.5 border rounded placeholder-green-600"
            placeholder="Stock (KGs)"
            required
          />

          <label style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', display: 'block', color: 'green' }}>
            Expiration Date:
          </label>

          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full p-1 border rounded placeholder-green-600"
            placeholder="Expiration Date"
            required
          />

          <label style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', display: 'block', color: 'green' }}>
            Manufacture Date:
          </label>

          <input
            type="date"
            name="manufactureDate"
            value={formData.manufactureDate}
            onChange={handleChange}
            className="w-full p-1 border rounded placeholder-green-600"
            placeholder="Manufacture Date"
            required
          />

              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-1.5 border rounded placeholder-green-600"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Rice">Rice</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded placeholder-green-600"
            placeholder="Product Description"
          ></textarea>

          <input
            type="file"
            name="productPicture"
            onChange={handleChange}
            className="w-full p-1.5 border rounded placeholder-green-600"
            accept="image/*"
          />
      

          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuyerAddProducts;
