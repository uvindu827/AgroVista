import React from "react";
import "./App.css";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import { Route, Routes } from "react-router";
import FarmerPage from "./components/FarmerPage/farmerPage";

import { Toaster } from "react-hot-toast";
import BHomePage from "./components/home/bhomePage";
import Test from "./components/Test/Testingp4";

function App() {
  return (
    <div>
      <React.Fragment>
        <Toaster position="top-right" />
        <Routes path="/*">
          <Route path="/testing" element={<Test />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/farmer/*" element={<FarmerPage />} />
          <Route path="/*" element={<BHomePage />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
