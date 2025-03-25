import React from 'react';
import './App.css';
import Staff from './components/StaffDetails/Staff';
import {Route, Routes} from 'react-router';

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Staff />}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
