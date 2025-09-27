import React from "react";
import { Routes, Route } from "react-router-dom";

// Public pages
import Login from './components/Login/login'; 
import RegisterPage from "./components/Register/register";

// Payment result pages
import PaymentSuccess from "./components/Farmer/pages/PaymentSuccess";
import PaymentCancel from "./components/Farmer/pages/PaymentCancel";

// Buyer pages
import BuyerHomePage from './components/BuyerHomePage/BuyerHomePage';
import BuyerAddProducts from './components/BuyerAddProducts/BuyerAddProducts';
import BuyerManageProducts from './components/BuyerManageProducts/BuyerManageProducts';
import BuyerUpdateProducts from './components/BuyerUpdateProducts/BuyerUpdateProducts';

// Admin pages
import AdminDashboard from "./components/Admin_dashboard/adminDashboard";
import Staff from "./components/StaffDetails/Staff";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import UpdateEmployee from './components/UpdateEmployee/updateEmployee';

// News Feed Management
import NFManagement from "./components/NewsFeedManagement/NFManagement";
import AddPost from "./components/NewsFeedManagement/AddPost";
import UpdateNFPost from "./components/NewsFeedManagement/UpdateNFPost";
import ReportsList from "./components/NewsFeedManagement/ReportsList";

// User-facing news feed
import NewsFeed from "./components/Newsfeed/UserNewsfeed";
import PostDetails from "./components/Newsfeed/PostDetails";
import PostReportPage from "./components/Newsfeed/postReportPage";

// User management
import UserManagementDashboard from "./components/UsersManagement/UserManagementDashboard";

// Instructor dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import AddCoursePage from "./pages/AddCoursePage";
import PurchasesPage from "./components/Farmer/PaidCourses";

// Farmer dashboard (with nested routes)
import FarmerDashboard from "./components/Farmer/FarmerDashboard";

// Orders
import ViewOrders from "./components/Admin/ViewOrders";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/users" element={<RegisterPage />} />

      {/* Buyer Routes */}
      <Route path="/buyerHome" element={<BuyerHomePage />} />
      <Route path="/add-product" element={<BuyerAddProducts />} />
      <Route path="/manage-products" element={<BuyerManageProducts />} />
      <Route path="/update-product/:id" element={<BuyerUpdateProducts />} />

      {/* Admin Routes */}
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/update_employee/:id" element={<UpdateEmployee />} />

      {/* News Feed Management */}
      <Route path="/nf-management" element={<NFManagement />} />
      <Route path="/add-post" element={<AddPost />} />
      <Route path="/update_post/:id" element={<UpdateNFPost />} />
      <Route path="/report_list" element={<ReportsList />} />

      {/* User-Facing News Feed */}
      <Route path="/newsfeed" element={<NewsFeed />} />
      <Route path="/postDetails/:postId" element={<PostDetails />} />
      <Route path="/postReport/:postId" element={<PostReportPage />} />

      {/* User Management */}
      <Route path="/users_management" element={<UserManagementDashboard />} />

      {/* Instructor Dashboard with nested routes */}
      <Route path="/instructor" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="add-course" element={<AddCoursePage />} />
        <Route path="purchases" element={<PurchasesPage />} />
      </Route>

      {/* Farmer Dashboard with nested routes */}
      <Route path="/farmer/*" element={<FarmerDashboard />} />

      {/* Payment result pages */}
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />

      {/* Order viewing */}
      <Route path="/admin/view-orders" element={<ViewOrders />} />
      <Route path="/inspector/course-purchases" element={<ViewOrders />} />
    </Routes>
  );
}

export default App;
