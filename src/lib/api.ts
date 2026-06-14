import { Product, User, Order, Address, CartItem } from '../types';

const API_BASE = 'http://localhost:4000/api';
const TOKEN_KEY = 'aura_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

class ApiError extends Error {}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const roleFromApi = (role: string): User['role'] => role.toLowerCase() as User['role'];
export const roleToApi = (role: User['role']): string => role.toUpperCase();

function mapProduct(p: any): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    reviewCount: p.reviewCount,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    isTrending: p.isTrending,
    isDealOfDay: p.isDealOfDay,
    recentlyViewed: p.recentlyViewed,
  };
}

function mapUser(u: any): User {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: roleFromApi(u.role),
    isActive: u.isActive,
    joinedDate: u.joinedDate,
  };
}

function mapOrder(o: any): Order {
  const items: CartItem[] = (o.items || []).map((item: any) => ({
    id: `${item.productId}-${item.selectedColorName}-${item.selectedSize}`,
    product: mapProduct(item.product),
    quantity: item.quantity,
    selectedSize: item.selectedSize,
    selectedColor: { name: item.selectedColorName, hex: item.selectedColorHex },
  }));

  const address: Address = {
    fullName: o.fullName,
    phone: o.phone,
    addressLine: o.addressLine,
    city: o.city,
    state: o.state,
    zipCode: o.zipCode,
    country: o.country,
  };

  return {
    id: o.id,
    date: o.date,
    items,
    subtotal: o.subtotal,
    discount: o.discount,
    tax: o.tax,
    deliveryFee: o.deliveryFee,
    total: o.total,
    address,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    customerEmail: o.customerEmail,
  };
}

export interface AuthResult {
  token: string;
  user: User;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthResult> {
    const data = await apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return { token: data.token, user: mapUser(data.user) };
  },

  async register(email: string, password: string, fullName: string): Promise<AuthResult> {
    const data = await apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    return { token: data.token, user: mapUser(data.user) };
  },

  async getMe(): Promise<User> {
    const data = await apiFetch<any>('/users/me');
    return mapUser(data);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const data = await apiFetch<any[]>('/products');
    return data.map(mapProduct);
  },

  async createProduct(product: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> {
    const data = await apiFetch<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return mapProduct(data);
  },

  async updateProduct(product: Product): Promise<Product> {
    const data = await apiFetch<any>(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return mapProduct(data);
  },

  async deleteProduct(id: string): Promise<void> {
    await apiFetch<void>(`/products/${id}`, { method: 'DELETE' });
  },

  // Orders
  async getAllOrders(): Promise<Order[]> {
    const data = await apiFetch<any[]>('/orders');
    return data.map(mapOrder);
  },

  async getMyOrders(): Promise<Order[]> {
    const data = await apiFetch<any[]>('/orders/my');
    return data.map(mapOrder);
  },

  async createOrder(payload: {
    items: { productId: string; quantity: number; selectedSize: string; selectedColorName: string; selectedColorHex: string }[];
    discount: number;
    tax: number;
    deliveryFee: number;
    paymentMethod: string;
    address: Address;
  }): Promise<Order> {
    const data = await apiFetch<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapOrder(data);
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const data = await apiFetch<any>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return mapOrder(data);
  },

  // Users
  async getUsers(): Promise<User[]> {
    const data = await apiFetch<any[]>('/users');
    return data.map(mapUser);
  },

  async createUser(user: { email: string; fullName: string; role: User['role']; isActive: boolean; password?: string }): Promise<User> {
    const data = await apiFetch<any>('/users', {
      method: 'POST',
      body: JSON.stringify({ ...user, role: roleToApi(user.role) }),
    });
    return mapUser(data);
  },

  async updateUser(user: User): Promise<User> {
    const data = await apiFetch<any>(`/users/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        email: user.email,
        fullName: user.fullName,
        role: roleToApi(user.role),
        isActive: user.isActive,
      }),
    });
    return mapUser(data);
  },

  async deleteUser(id: string): Promise<void> {
    await apiFetch<void>(`/users/${id}`, { method: 'DELETE' });
  },

  // Reviews
  async addReview(productId: string, rating: number, comment: string): Promise<void> {
    await apiFetch<void>(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
};

export { ApiError };
