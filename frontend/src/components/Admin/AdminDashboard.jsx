import React from 'react';

const AdminDashboard = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <ul>
      <li><a href="/manage-users">Manage Users</a></li>
      <li><a href="/manage-products">Manage Products</a></li>
      <li><a href="/view-orders">View Orders</a></li>
      <li><a href="/manage-tooldealers">Manage Tool Dealers</a></li>
    </ul>
  </div>
);

export default AdminDashboard;