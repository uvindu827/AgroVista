import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Manage Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>Order #{order._id} - {order.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageOrders;