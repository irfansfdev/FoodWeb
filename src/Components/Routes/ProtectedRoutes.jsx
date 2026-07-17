import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔒 Redirect Admin users away from customer checkout/cart pages to their dashboard
  if (userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}