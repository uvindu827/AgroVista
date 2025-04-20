import React from "react";
import "./App.css";
import Staff from "./components/StaffDetails/Staff";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import UpdateEmployee from "./components/UpdateEmployee/updateEmployee";
import { Route, Routes } from "react-router";
import RegisterPage from "./components/Register/register";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Staff />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/update_employee/:id" element={<UpdateEmployee />} />
          <Route path="/users/" element={<RegisterPage />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
