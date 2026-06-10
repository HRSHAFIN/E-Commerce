export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: 'Men' | 'Women' | 'Kids' | 'Accessories' | 'Lifestyle';
  brand: string;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: string[];
  colors: Color[];
  stock: number;
  isTrending?: boolean;
  isDealOfDay?: boolean;
  recentlyViewed?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CartItem {
  id: string; // Composite unique key: productId-color-size
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: Color;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  address: Address;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending';
  customerEmail: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  joinedDate: string;
}

export interface StoreFilters {
  category: string;
  brands: string[];
  priceRange: [number, number];
  rating: number | null;
  search: string;
  sortBy: 'recommended' | 'price-low-to-high' | 'price-high-to-low' | 'customer-rating';
}
