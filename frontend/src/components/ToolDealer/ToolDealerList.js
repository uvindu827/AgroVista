import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ToolDealerList = () => {
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    axios.get('/api/tooldealers')
      .then(res => setDealers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Tool Dealers</h2>
      <ul>
        {dealers.map(dealer => (
          <li key={dealer._id}>{dealer.name} - {dealer.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ToolDealerList;