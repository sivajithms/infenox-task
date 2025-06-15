import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import api from "@/lib/axios";

type ProductDetailProps = {
  setCartCount: (count: number) => void;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ setCartCount }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  // Fetch product details
  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get<Product>(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Failed to fetch product details. Please try again.");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const response = await api.get<{ count: number }>("/cart/count");
      setCartCount(response.data.count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);

      const response = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();

      if (data.success) {
        // Update cart count
        await fetchCartCount();

        // Reset quantity to 1
        setQuantity(1);

        // Show success feedback (optional)
        alert("Product added to cart successfully!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setQuantity(numValue);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCartCount();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  // Ensure we have at least 4 placeholder images if product doesn't have enough
  const displayImages = [...(product.images || [])];
  while (displayImages.length < 4) {
    displayImages.push("/api/placeholder/400/400");
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
            <img
              src={displayImages[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {displayImages.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-xs text-gray-500">Id: {product._id}</span>
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-4">
              ${product.price.toFixed(2)}
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              In Stock
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityInput(e.target.value)}
                className="w-16 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
