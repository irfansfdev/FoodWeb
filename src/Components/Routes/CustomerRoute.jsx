import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function CustomerRoute({ children }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Read role from Redux user object, fallback to localStorage
  const userRole = user?.role || user?.user_type || localStorage.getItem("userRole");

  console.log(`🛡️ CustomerRoute Guard: User role is "${userRole}", path: ${location.pathname}`);

  // If the user is an admin trying to view customer store pages, redirect to admin dashboard
  if (userRole === "admin") {
    console.log("🚨 Admin detected on customer route! Directing to dashboard.");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Allow normal customers and guests
  return children;
}