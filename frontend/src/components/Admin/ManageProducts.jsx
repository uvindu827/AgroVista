import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Manage Products</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>{product.name} - {product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;