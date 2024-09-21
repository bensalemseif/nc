import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./utils/ErrorBoundary";

import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";




// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AddProduct from "./pages/admin/AddProduct";
import Order from "./pages/admin/Order";
import AdminProfile from "./pages/admin/AdminProfile";
import CadeauProduct from "./pages/admin/CadeauProduct";
import CategoryPage from "./pages/admin/CategoryPage";
import ProductDetailsAdmin from "./pages/admin/ProductDetailsAdmin";
import PromotionPage from "./pages/admin/PromotionPage";
import Settings from "./pages/admin/Settings";
import AdminChatPage from "./pages/admin/AdminChatPage";

// User Pages
import Login from "./pages/Login";
import Signup from "./pages/user/Signup";
import ForgotPassword from "./pages/user/ForgotPassword";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import ProductList from "./pages/user/ProductList";
import Cart from "./pages/user/Cart";
import FavList from "./pages/user/FavList";
import Profile from "./pages/user/Profile";
import LandingPage from "./pages/LandingPage";
import ProductPromotionList from "./pages/user/ProductPromotionList";
import Checkout from "./pages/user/Checkout";
import AboutUs from "./pages/user/AboutUs";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { PopupProvider } from "./utils/popupUtils";
import EmailValidationPage from "./pages/user/EmailValidation";
import ServerError from "./components/ServerError";
import ServerUnreachable from "./components/ServerUnreachable";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
        <AuthProvider>
          <PopupProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/500" element={<ServerError />} />
              <Route
                path="/server-unreachable"
                element={<ServerUnreachable />}
              />

              {/* User Routes ang guest*/}
              <Route element={<UserLayout />}>
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/user/product-list" element={<ProductList />} />
                  <Route
                    path="/user/product-details/:productId"
                    element={<ProductDetailsPage />}
                  />
                  <Route
                    path="/user/promotion-list"
                    element={<ProductPromotionList />}
                  />
                  <Route path="/user/about-us" element={<AboutUs />} />
                  <Route
                    path="/email-validation"
                    element={<EmailValidationPage />}
                  />
                </Route>
                <Route
                  path="/user/profile"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/cart"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/favorites"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <FavList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/checkout"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/add-product"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/order"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Order />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/messages"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/cadeau-product"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <CadeauProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/category"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <CategoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/product-details/:id"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <ProductDetailsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/promotion"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <PromotionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Email Validation */}
              <Route
                path="/email-validation"
                element={<EmailValidationPage />}
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PopupProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
