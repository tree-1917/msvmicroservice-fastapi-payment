import logo from "./logo.svg";
import "./App.css";
import { Product } from "./components/Products";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductCreate } from "./components/ProductCreate";
import { Order } from "./components/order";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/create" element={<ProductCreate />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
