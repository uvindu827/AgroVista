import React from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import BuyerHomePage from "./components/BuyerHomePage/BuyerHomePage";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import Staff from "./components/StaffDetails/Staff";
import UpdateEmployee from "./components/UpdateEmployee/updateEmployee";
import AdminDashboard from "./components/Admin_dashboard/adminDashboard";
import NFManagement from "./components/NewsFeedManagement/NFManagement";
import AddPost from "./components/NewsFeedManagement/AddPost";
import UpdateNFPost from "./components/NewsFeedManagement/UpdateNFPost";
import NewsFeed from "./components/Newsfeed/UserNewsfeed";
import PostDetails from "./components/Newsfeed/PostDetails";
import PostReportPage from "./components/Newsfeed/postReportPage";
import ReportsList from "./components/NewsFeedManagement/ReportsList";
import { Route, Routes } from "react-router";
import RegisterPage from "./components/Register/register";
import BuyerAddProducts from "./components/BuyerAddProducts/BuyerAddProducts";
import BuyerManageProducts from "./components/BuyerManageProducts/BuyerManageProducts";
import Login from "./components/Login/login";
import BuyerUpdateProducts from "./components/BuyerUpdateProducts/BuyerUpdateProducts";
import Test from "./components/Test/Testingp4";
import FarmerPage from "./components/FarmerProfilePage/farmerPage";

import BHomePage from "./components/FarmerProductOverview/bhomePage";
import ProductOverview from "./components/FarmerProductOverview/productOverview";
import PurchasePage from "./components/FarmerProductOverview/purchasePage";
import UserManagementDashboard from "./components/UsersManagement/UserManagementDashboard";


function App() {
  return (
    <div>
      <React.Fragment>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/buyerHome" element={<BuyerHomePage />} />
          <Route path="/add-product" element={<BuyerAddProducts />} />
          <Route path="/manage-products" element={<BuyerManageProducts />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/update_employee/:id" element={<UpdateEmployee />} />
          <Route path="/nf-management" element={<NFManagement />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="update_post/:id" element={<UpdateNFPost />} />
          <Route path="/postDetails/:postId" element={<PostDetails />} />
          <Route path="/postReport/:postId" element={<PostReportPage />} />
          <Route path="/report_list" element={<ReportsList />} />
          <Route path="/newsfeed" element={<NewsFeed />} />
          <Route path="/users/" element={<RegisterPage />} />
          <Route path="/update-product/:id" element={<BuyerUpdateProducts />} />
          <Route path="/users_management" element={<UserManagementDashboard />} />
          <Route path="/testing" element={<Test />} />
          <Route path="/farmer/*" element={<FarmerPage />} />
          <Route path="/*" element={<BHomePage />} />
          <Route path="/product/:key" element={<ProductOverview />} />
          <Route path="/cart" element={<PurchasePage/>} />

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
