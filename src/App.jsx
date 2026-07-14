import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Pages/Customer/Home";
import Restaurant from "./Pages/Customer/Restaurant";
import Login from "./Pages/Customer/Login";
import Signup from "./Pages/Customer/Signup";
import AuthModal from "./Components/Authentication/AuthModal";
import OrderTracking from "./Pages/Customer/OrderTracking";
import Cart from "../src/Pages/Customer/Cart";
import DealDetail from "./Pages/Customer/DealDetail";
import CategoryDetail from "./Pages/Customer/CategoryDetail";
import ScrollToTop from "./Components/Common/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/orders/track" element={<OrderTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/deals/:id" element={<DealDetail />} />
        <Route path="/category/:categoryId" element={<CategoryDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

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
