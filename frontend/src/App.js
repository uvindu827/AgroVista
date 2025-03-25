import React from 'react';
import './App.css';
import Staff from './components/StaffDetails/Staff';
import AddEmployee from './components/AddEmployee/AddEmployee';
import {Route, Routes} from 'react-router';

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Staff />}/>
          <Route path="/add-employee" element={<AddEmployee />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
