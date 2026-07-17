import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global Components
import AuthModal from "./Components/Common/AuthModal";
import ScrollToTop from "./Components/Common/ScrollToTop";

// Routing Module
import AppRoutes from "./Components/Routes/AppRoutes";

function App() {
  return (
    <Router>
      {/* Utility to scroll page to top on route change */}
      <ScrollToTop />

      {/* Central Routing Module */}
      <AppRoutes />

      {/* Persistent global layout components */}
      <AuthModal />

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        theme="colored"
      />
    </Router>
  );
}

export default App;