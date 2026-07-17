import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token || userRole !== "admin") {
    // If not logged in or not an admin, boot them back to login
    return <Navigate to="/login" replace />;
  }

  return children;
}