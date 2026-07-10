import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Customer/Home";
import Restaurant from "./Pages/Customer/Restaurant";
import Login from "./Pages/Customer/Login";
import Signup from "./Pages/Customer/Signup";
import AuthModal from "./Components/Authentication/AuthModal";
import OrderTracking from './Pages/Customer/OrderTracking';
import Cart from "./Pages/Customer/Cart"; // 1. Import your Cart page component here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/orders/track" element={<OrderTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 2. Added the new Cart route below */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <AuthModal />
    </Router>
  );
}

export default App;