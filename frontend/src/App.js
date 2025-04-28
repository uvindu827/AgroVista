import React from "react";
import "./App.css";
import BuyerHomePage from './components/BuyerHomePage/BuyerHomePage';
import AddEmployee from "./components/AddEmployee/AddEmployee";
import Staff from "./components/StaffDetails/Staff";
import UpdateEmployee from './components/UpdateEmployee/updateEmployee';
import AdminDashboard from "./components/Admin_dashboard/adminDashboard";
import NFManagement from "./components/NewsFeedManagement/NFManagement";
import AddPost from "./components/NewsFeedManagement/AddPost";
import UpdateNFPost from "./components/NewsFeedManagement/UpdateNFPost";
import NewsFeed from "./components/Newsfeed/UserNewsfeed";
import PostDetails from "./components/Newsfeed/PostDetails";
import { Route, Routes } from "react-router";
import RegisterPage from "./components/Register/register";
import BuyerAddProducts from './components/BuyerAddProducts/BuyerAddProducts';
import BuyerManageProducts from './components/BuyerManageProducts/BuyerManageProducts';
import Login from './components/Login/login'; 
import BuyerUpdateProducts from './components/BuyerUpdateProducts/BuyerUpdateProducts';
import BuyersList from "./components/BuyersList/BuyersList";
import BuyerInventoryList from "./components/BuyerInventoryList/BuyerInventoryList";
import CartPage from "./components/CartPage/CartPage";
import CustomerPaymentPage from "./components/CustomerPaymentPage/CustomerPaymentPage"; 
import OrderSuccessPage from "./components/OrderSuccessPage/OrderSuccessPage";
import BuyerOrders from "./components/BuyerOrders/BuyerOrders";
import ChartDashboard from "./components/ChartDashboard/ChartDashboard";
import PaymentDetails from "./components/PaymentDetails/PaymentDetails";
import Header from "./components/Header/Header"; 


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/buyerHome" element={<BuyerHomePage />} />
          <Route path="/add-product" element={<BuyerAddProducts />} />
          <Route path="/manage-products" element={<BuyerManageProducts/>} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/update_employee/:id" element={<UpdateEmployee />} />
          <Route path="/nf-management" element={<NFManagement/>} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="update_post/:id" element={<UpdateNFPost />} />
          <Route path="/postDetails" element={<PostDetails />} />
          <Route path="/newsfeed" element={<NewsFeed/>} />
          <Route path="/users/" element={<RegisterPage />} />
          <Route path="/update-product/:id" element={<BuyerUpdateProducts />} />
          <Route path="/buyer/:buyerId" element={<BuyersList/>} />
          <Route path="/buyer/:buyerId/inventory" element={<BuyerInventoryList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/customer-order" element={<CustomerPaymentPage />} />
          <Route path="/ordersuccess" element={<OrderSuccessPage />} />
          <Route path="/manage-purchases" element={<BuyerOrders />} />
          <Route path="/dashboard" element={<ChartDashboard />} />
          <Route path="/manage-sales" element={<PaymentDetails />} />
          <Route path="/manage-sales" element={<Header />} />

          
          
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
