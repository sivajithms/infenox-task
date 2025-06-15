import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";

export default function App() {
  const [cartCount, setCartCount] = useState<number>(0);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} setCartCount={setCartCount} />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route
          path="/product/:id"
          element={<ProductDetail setCartCount={setCartCount} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
