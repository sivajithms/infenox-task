import type { PaginationProps } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer flex items-center px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="ml-1">Previous</span>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 border rounded-md ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer flex items-center px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <span className="mr-1">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
