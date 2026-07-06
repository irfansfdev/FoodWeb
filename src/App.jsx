import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Customer/Home";
import Restaurant from "./Pages/Customer/Restaurant";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<Restaurant />} />
    </Routes>
  );
}

export default App;