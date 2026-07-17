import { Navigate, useLocation } from "react-router-dom";

export default function CustomerRoute({ children }) {
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  // 🔍 Debugging log: See what the guard is detecting
  console.log(`🛡️ CustomerRoute Guard: User is ${userRole}, trying to access ${location.pathname}`);

  // If the user is an admin, instantly replace the URL with the admin dashboard
  if (userRole === "admin") {
    console.log("🚨 Admin detected! Bouncing back to dashboard.");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, allow normal customers and guests to view the page
  return children;
}