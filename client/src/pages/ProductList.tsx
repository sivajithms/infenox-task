import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { SortDropdown } from "@/components/SortDropdown";
import api from "@/lib/axios";
import type { ErrorMessageProps, Product } from "@/types/product";
import React, { useEffect, useState } from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
    {message}
  </div>
);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortValue, setSortValue] = useState<string>("");
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const LIMIT = 3;
  const totalPages = Math.ceil(totalProducts / LIMIT);

  const fetchProducts = async (
    page: number = 1,
    sort: string = ""
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        page: page.toString(),
        limit: LIMIT.toString(),
      };

      if (sort) {
        params.sort = sort;
      }

      const response = await api.get<Product[]>("/products", { params });

      setProducts(response.data);

      if (response.data.length < LIMIT && page === 1) {
        setTotalProducts(response.data.length);
      } else {
        setTotalProducts(
          page * LIMIT + (response.data.length === LIMIT ? 1 : 0)
        );
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, sortValue);
  }, [currentPage, sortValue]);

  const handleSortChange = (newSort: string): void => {
    setSortValue(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Products
        </h1>
        <div className="w-48">
          <SortDropdown sortValue={sortValue} onSortChange={handleSortChange} />
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing page {currentPage} of {totalPages}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
