import React from 'react';
import './App.css';
import Staff from './components/StaffDetails/Staff';
import AddEmployee from './components/AddEmployee/AddEmployee';
import {Route, Routes} from 'react-router';
import UpdateEmployee from './components/UpdateEmployee/UpdateEmployee';

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Staff />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/updateEmp/:id" element={<UpdateEmployee/>} />
          <Route path="/users/" element={<RegisterPage />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
