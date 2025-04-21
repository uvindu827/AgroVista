import React from "react";
import "./App.css";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import Staff from "./components/StaffDetails/Staff";
import UpdateEmployee from "./components/UpdateEmployee/updateEmployee";
import AdminDashboard from "./components/Admin_dashboard/adminDashboard";
import NFManagement from "./components/NewsFeedManagement/NFManagement";
import AddPost from "./components/NewsFeedManagement/AddPost";
import { Route, Routes } from "react-router";
import RegisterPage from "./components/Register/register";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/update_employee/:id" element={<UpdateEmployee />} />
          <Route path="/nf-management" element={<NFManagement/>} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/users/" element={<RegisterPage />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
