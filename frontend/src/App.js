import React from "react";
import "./App.css";
import Staff from "./components/StaffDetails/Staff";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import { Route, Routes } from "react-router";
import RegisterPage from "./components/Register/register";
import LoginPage from "./components/Login/login";
import FarmerPage from "./components/FarmerPage/farmerPage";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Staff />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/users/" element={<RegisterPage />} />
          <Route path="/users/login/" element={<LoginPage/>}/>
          <Route path="/farmer/*" element={<FarmerPage />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
