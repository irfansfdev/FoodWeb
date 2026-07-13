import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Customer/Home";
import Restaurant from "./Pages/Customer/Restaurant";
import Login from "./Pages/Customer/Login";
import Signup from "./Pages/Customer/Signup";
import AuthModal from "./Components/Authentication/AuthModal";
import OrderTracking from './Pages/Customer/OrderTracking';
import Cart from "../src/Pages/Customer/Cart";
import DealDetail from "./Pages/Customer/DealDetail"; 
import CategoryDetail from "./Pages/Customer/CategoryDetail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/orders/track" element={<OrderTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/deals/:id" element={<DealDetail />} />
        <Route path="/category/:categoryId" element={<CategoryDetail />} />

        <Route path="/cart" element={<Cart />} />
      </Routes>
      <AuthModal />
    </Router>
  );
}

export default App;