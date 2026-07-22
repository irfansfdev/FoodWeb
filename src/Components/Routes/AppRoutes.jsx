import { Routes, Route } from "react-router-dom";
// Guards (assuming this file is inside the Routes folder)
import ProtectedRoute from "./ProtectedRoutes";
import AdminRoute from "./AdminRoute";
import CustomerRoute from "./CustomerRoute";

// Customer Pages
import Home from "../../Pages/Customer/Home";
import Restaurant from "../../Pages/Customer/Restaurant";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";
import OrderTracking from "../../Pages/Customer/OrderTracking";
import Cart from "../../Pages/Customer/Cart";
import DealDetail from "../../Pages/Customer/DealDetail";
import CategoryDetail from "../../Pages/Customer/CategoryDetail";
import Checkout from "../../Pages/Customer/Checkout";

import DashboardHome from "../../Pages/Admin/AdminDashboard"



export default function AppRoutes() {
  return (
    <Routes>
      {/* ========================================== */}
      {/* 🔓 PUBLIC CUSTOMER ROUTES (Admins Blocked) */}
      {/* ========================================== */}
      <Route
        path="/"
        element={
          <CustomerRoute>
            <Home />
          </CustomerRoute>
        }
      />
      <Route
        path="/restaurant/:id"
        element={
          <CustomerRoute>
            <Restaurant />
          </CustomerRoute>
        }
      />
      <Route
        path="/login"
        element={
          <CustomerRoute>
            <Login />
          </CustomerRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <CustomerRoute>
            <Signup />
          </CustomerRoute>
        }
      />
      <Route
        path="/deals/:id"
        element={
          <CustomerRoute>
            <DealDetail />
          </CustomerRoute>
        }
      />
      <Route
        path="/category/:categoryId"
        element={
          <CustomerRoute>
            <CategoryDetail />
          </CustomerRoute>
        }
      />

      {/* ========================================== */}
      {/* 🔒 PROTECTED CUSTOMER ROUTES               */}
      {/* ========================================== */}
      <Route
        path="/orderTrack/:id"
        element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      {/* ========================================== */}
      {/* 🛠️ PROTECTED ADMIN ROUTES                   */}
      {/* ========================================== */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <DashboardHome />
          </AdminRoute>
        }
      />

    </Routes>
  );
}
