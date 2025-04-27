import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const validateForm = (data) => {
  const errors = {};

  // Product Name validation
  if (!data.productName.trim()) {
    errors.productName = 'Product name is required';
  } else if (!/^[A-Za-z\s]{3,50}$/.test(data.productName)) {
    errors.productName = 'Product name must be 3-50 characters long and contain only letters';
  }

  // Price validation
  if (!data.price) {
    errors.price = 'Price is required';
  } else if (parseFloat(data.price) <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  // Stock validation
  if (!data.stock) {
    errors.stock = 'Stock is required';
  } else if (parseInt(data.stock) < 0) {
    errors.stock = 'Stock cannot be negative';
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Description validation
  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return errors;
};

function BuyerUpdateProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    price: '',
    productName: '',
    stock: '',
    expirationDate: '',
    manufactureDate: '',
    category: '',
    description: '',
    buyerID: '',
  });
  const [productPicture, setProductPicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Clear the specific error when field is changed
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
      
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setProductPicture(file);
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:3000/api/inventory/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log('Fetched inventory:', data);
        setFormData({
          price: data.price?.toString() || '',
          productName: data.productName || '',
          stock: data.stock?.toString() || '',
          expirationDate: data.expirationDate
            ? new Date(data.expirationDate).toISOString().split('T')[0]
            : '',
          manufactureDate: data.manufactureDate
            ? new Date(data.manufactureDate).toISOString().split('T')[0]
            : '',
          category: data.category || '',
          description: data.description || '',
          buyerID: data.buyerID || '',
        });
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error(error.response?.data?.message || 'Error fetching inventory details');
        setError(error.response?.data?.message || 'Error fetching inventory details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchInventory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const errors = validateForm(formData);
    setValidationErrors(errors);

    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updateData = new FormData();
      updateData.append('buyerID', formData.buyerID);
      updateData.append('price', formData.price);
      updateData.append('productName', formData.productName);
      updateData.append('stock', formData.stock);
      updateData.append('expirationDate', formData.expirationDate);
      updateData.append('manufactureDate', formData.manufactureDate);
      updateData.append('category', formData.category);
      updateData.append('description', formData.description);
      if (productPicture) {
        updateData.append('productPicture', productPicture);
      }

      console.log('Form data before sending:', formData);
      for (let [key, value] of updateData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

      const response = await axios.put(`http://localhost:3000/api/inventory/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Full server response:', JSON.stringify(response.data, null, 2));

      // Refetch to verify database state
      const refetchResponse = await axios.get(`http://localhost:3000/api/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Refetched data:', JSON.stringify(refetchResponse.data, null, 2));

      // Verify the response matches the sent data
      const { productName, stock, price, category, description, expirationDate, manufactureDate } = refetchResponse.data;
      const expected = {
        productName: formData.productName,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        expirationDate: formData.expirationDate,
        manufactureDate: formData.manufactureDate,
      };
      const received = {
        productName,
        stock,
        price,
        category,
        description,
        expirationDate: expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : '',
        manufactureDate: manufactureDate ? new Date(manufactureDate).toISOString().split('T')[0] : '',
      };
      if (JSON.stringify(expected) !== JSON.stringify(received)) {
        console.warn('Update mismatch:', { expected, received });
        toast.error('Some fields were not updated correctly');
      } else {
        toast.success('Product updated successfully!');
        navigate('/manage-products');
      }
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating product');
      setError(error.response?.data?.message || 'Error updating product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-green-900 mb-8">Update Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 
                  ${validationErrors.productName ? 'border-red-300' : 'border-gray-300'}`}
                  required
                />
                {validationErrors.productName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.productName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (per kg) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 
                  ${validationErrors.price ? 'border-red-300' : 'border-gray-300'}`}
                  required
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock (in kg) *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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

              {/*<div>
                <label className="block text-sm font-medium text-gray-700">Expiration Date *</label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Manufacture Date *</label>
                <input
                  type="date"
                  name="manufactureDate"
                  value={formData.manufactureDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div> */}
            </div> 

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/manage-products')}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
              >
                {isLoading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuyerUpdateProducts;