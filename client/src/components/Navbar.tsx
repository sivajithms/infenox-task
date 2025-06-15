import api from "@/lib/axios";
import { ShoppingCart, Store } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

type NavbarProps = {
  cartCount: number;
  setCartCount: (count: number) => void;
};

export function Navbar({ cartCount, setCartCount }: NavbarProps) {
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await api.get<{ count: number }>("/cart/count");
        setCartCount(response.data.count);
      } catch (err) {
        console.error("Error fetching cart count:", err);
      }
    };
    fetchCartCount();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <Link
        to="/"
        className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
      >
        <Store className="w-6 h-6" />
        <span>Online Store</span>
      </Link>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {cartCount} items in cart
          </span>
        </div>
      </div>
    </nav>
  );
}
