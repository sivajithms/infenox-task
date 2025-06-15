export type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
};

export type ProductCardProps = {
  product: Product;
};

export type SortDropdownProps = {
  sortValue: string;
  onSortChange: (value: string) => void;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type ErrorMessageProps = {
  message: string;
};
