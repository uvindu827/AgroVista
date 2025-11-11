import React, { useState } from 'react';
import axios from 'axios';

const ToolDealerForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/tooldealers', form)
      .then(res => alert('Tool Dealer added!'))
      .catch(err => alert('Error adding dealer'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <button type="submit">Add Tool Dealer</button>
    </form>
  );
};

export default ToolDealerForm;