import React, { useState } from 'react';
import BuyerNavBar from '../BuyerNavBar/BuyerNavBar';

function BuyerAddProducts() {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    stock: '',
    expirationDate: '',
    manufactureDate: '',
    category: '',
    description: '',
    productPicture: null
  });

  const handleChange = (e) => {
    if (e.target.name === 'productPicture') {
      setFormData({ ...formData, productPicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        alert('Product added successfully!');
        setFormData({
          productName: '',
          price: '',
          stock: '',
          expirationDate: '',
          manufactureDate: '',
          category: '',
          description: '',
          productPicture: null
        });
      } else {
        alert(data.error || 'Failed to add product.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error.');
    }
  };

  return (
    <div className="flex">
      <BuyerNavBar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="productName" value={formData.productName} onChange={handleChange}
            className="w-full p-2 border rounded" placeholder="Product Name" required />

          <input type="number" name="price" value={formData.price} onChange={handleChange}
            className="w-full p-2 border rounded" placeholder="Price per KG" required />

          <input type="number" name="stock" value={formData.stock} onChange={handleChange}
            className="w-full p-2 border rounded" placeholder="Stock (KGs)" required />

          <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange}
            className="w-full p-2 border rounded" placeholder="Expiration Date" required />

          <input type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleChange}
            className="w-full p-2 border rounded" placeholder="Manufacture Date" required />

          <input type="text" name="category" value={formData.category} onChange={handleChange}
            className="w-full p-2 border rounded"  placeholder="Category" required />

          <textarea name="description" value={formData.description} onChange={handleChange}
            className="w-full p-2 border rounded" placeholder="Product Description"></textarea>

          <input type="file" name="productPicture" onChange={handleChange}   
            className="w-full p-2 border rounded bg-gray-100" accept="image/*" />

          <button type="submit" className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-700">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuyerAddProducts;
