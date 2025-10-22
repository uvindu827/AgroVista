import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";
// ...existing imports from both branches (merged)
import BuyerHomePage from "./components/BuyerHomePage/BuyerHomePage";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import Staff from "./components/StaffDetails/Staff";
import UpdateEmployee from "./components/UpdateEmployee/updateEmployee";
import AdminDashboard from "./components/Admin_dashboard/adminDashboard";
import NFManagement from "./components/NewsFeedManagement/NFManagement";
import AddPost from "./components/NewsFeedManagement/AddPost";
import UpdateNFPost from "./components/NewsFeedManagement/UpdateNFPost";
import ReportsList from "./components/NewsFeedManagement/ReportsList";
import NewsFeed from "./components/Newsfeed/UserNewsfeed";
import PostDetails from "./components/Newsfeed/PostDetails";
import PostReportPage from "./components/Newsfeed/postReportPage";
import RegisterPage from "./components/Register/register";
import DisplayT from "./components/Tools/DisplayT";
import Atool from "./components/Tools/Atool";
import Welcome from "./components/Tools/welcome";
import BuyerAddProducts from "./components/BuyerAddProducts/BuyerAddProducts";
import BuyerManageProducts from "./components/BuyerManageProducts/BuyerManageProducts";
import Login from "./components/Login/login";
import BuyerUpdateProducts from "./components/BuyerUpdateProducts/BuyerUpdateProducts";
import Test from "./components/Test/Testingp4";
// ...existing code...
import BHomePage from "./components/FarmerProductOverview/bhomePage";
import ProductOverview from "./components/FarmerProductOverview/productOverview";
import UserManagementDashboard from "./components/UsersManagement/UserManagementDashboard";
import BuyerNavBar from "./components/BuyerNavBar/BuyerNavBar";
import CartPage from "./components/CartPage";
import PurchasePage from "./components/FarmerProductOverview/purchasePage";
import OrdersPage from "./components/FarmerProfilePage/ordersPage";
import MyOrdersPage from "./components/FarmerProfilePage/MyOrdersPage";
import AdminInquiryResponsePage from "./components/Admin_dashboard/AdminInquiryResponsePage";
import PaymentSuccess from "./components/Farmer/pages/PaymentSuccess";
import PaymentCancel from "./components/Farmer/pages/PaymentCancel";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import AddCoursePage from "./pages/AddCoursePage";
import PurchasesPage from "./components/Farmer/PaidCourses";
import FarmerDashboard from "./components/Farmer/FarmerDashboard";
import ViewOrders from "./components/Admin/ViewOrders";
import CropDiseaseDetection from "./components/Farmer/pages/CropDiseaseDetection";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />
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
        {/* Other routes from previous branch */}
        <Route path="/jyhg" element={<DisplayT />} />
        <Route path="/e" element={<Atool />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/testing" element={<Test />} />
        <Route path="/*" element={<BHomePage />} />
        <Route path="/product/:key" element={<ProductOverview />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/dashboard" element={<BuyerNavBar />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/inquiries" element={<AdminInquiryResponsePage />} />
        <Route path="/crop-disease-detection" element={<CropDiseaseDetection />} />
      </Routes>
    </>
  );
}

export default App;
