import type { SortDropdownProps } from "@/types/product";


export const SortDropdown: React.FC<SortDropdownProps> = ({ sortValue, onSortChange }) => {
  return (
    <div className="relative">
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
        Sort by:
      </label>
      <select
        id="sort"
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Default</option>
        <option value="name">Name (A-Z)</option>
        <option value="price_asc">Price (Low to High)</option>
        <option value="price_desc">Price (High to Low)</option>
      </select>
    </div>
  );
};