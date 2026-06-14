import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, StoreFilters, Address, Color } from '../types';
import { api, getToken, setToken, ApiError } from '../lib/api';

interface AppContextType {
  products: Product[];
  users: User[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: User | null;
  authLoading: boolean;
  filters: StoreFilters;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  currentView: 'home' | 'plp' | 'pdp' | 'checkout' | 'admin' | 'profile';
  selectedProductId: string | null;
  selectedOrderSuccess: Order | null;

  // View Router
  navigateTo: (view: 'home' | 'plp' | 'pdp' | 'checkout' | 'admin' | 'profile', productId?: string | null) => void;

  // Cart Actions
  addToCart: (product: Product, quantity: number, size: string, color: Color) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Ordering
  placeOrder: (address: Address, paymentMethod: string) => Promise<Order | null>;
  clearOrderSuccess: () => void;

  // Authentication Actions
  loginAsUser: (email: string, password: string) => Promise<string | null>;
  logoutUser: () => void;

  // Filter Actions
  updateFilters: (updates: Partial<StoreFilters>) => void;
  resetFilters: () => void;

  // Admin Operations (CRUD)
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'joinedDate'>, password?: string) => Promise<string | null>;
  updateUser: (user: User) => Promise<string | null>;
  deleteUser: (userId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const defaultFilters: StoreFilters = {
  category: 'All',
  brands: [],
  priceRange: [0, 500],
  rating: null,
  search: '',
  sortBy: 'recommended'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState<StoreFilters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<AppContextType['currentView']>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderSuccess, setSelectedOrderSuccess] = useState<Order | null>(null);

  // Load orders/users appropriate to the current user's role
  const loadRoleData = async (user: User) => {
    try {
      if (user.role === 'admin') {
        const [allUsers, allOrders] = await Promise.all([api.getUsers(), api.getAllOrders()]);
        setUsers(allUsers);
        setOrders(allOrders);
      } else if (user.role === 'moderator') {
        const allOrders = await api.getAllOrders();
        setOrders(allOrders);
      } else {
        const myOrders = await api.getMyOrders();
        setOrders(myOrders);
      }
    } catch (err) {
      console.error('Failed to load role data', err);
    }
  };

  // Initial bootstrap: load products and restore session from token
  useEffect(() => {
    api.getProducts().then(setProducts).catch(err => console.error('Failed to load products', err));

    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    api.getMe()
      .then(async (user) => {
        setCurrentUser(user);
        await loadRoleData(user);
      })
      .catch(() => {
        setToken(null);
        setCurrentUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // Sync cart/wishlist to local storage when changed
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync Search Query with Filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  // Routing Handler
  const navigateTo = (view: AppContextType['currentView'], productId: string | null = null) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);

      // Update recentlyViewed property for the selected product
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, recentlyViewed: true };
        }
        return p;
      }));
    }
    // Scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Functions
  const addToCart = (product: Product, quantity: number, size: string, color: Color) => {
    const compositeId = `${product.id}-${color.name}-${size}`;
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === compositeId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { id: compositeId, product, quantity, selectedSize: size, selectedColor: color }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Ordering Flow
  const placeOrder = async (address: Address, paymentMethod: string): Promise<Order | null> => {
    if (cart.length === 0 || !currentUser) return null;

    const subtotal = cartTotal;
    const discount = subtotal > 200 ? 30 : subtotal > 100 ? 15 : 0;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const deliveryFee = subtotal > 150 ? 0 : 15;

    try {
      const newOrder = await api.createOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColorName: item.selectedColor.name,
          selectedColorHex: item.selectedColor.hex,
        })),
        discount,
        tax,
        deliveryFee,
        paymentMethod,
        address,
      });

      setOrders(prev => [newOrder, ...prev]);
      setSelectedOrderSuccess(newOrder);

      // Refresh product stock levels from the server
      api.getProducts().then(setProducts).catch(() => {});

      clearCart();
      return newOrder;
    } catch (err) {
      console.error('Failed to place order', err);
      return null;
    }
  };

  const clearOrderSuccess = () => {
    setSelectedOrderSuccess(null);
  };

  // Auth Operations
  const loginAsUser = async (email: string, password: string): Promise<string | null> => {
    try {
      const { token, user } = await api.login(email, password);
      setToken(token);
      setCurrentUser(user);
      await loadRoleData(user);
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.';
    }
  };

  const logoutUser = () => {
    setToken(null);
    setCurrentUser(null);
    setUsers([]);
    setOrders([]);
    navigateTo('home');
  };

  // Filter Updates
  const updateFilters = (updates: Partial<StoreFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters, search: searchQuery });
  };

  // Filtered Products Computing
  const filteredProducts = products.filter(product => {
    // Category check
    if (filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }
    // Brands check
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    // Price range check
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    // Rating check
    if (filters.rating !== null && product.rating < filters.rating) {
      return false;
    }
    // Search query check (case insensitive check across title, description, brand, category)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(q);
      const matchesBrand = product.brand.toLowerCase().includes(q);
      const matchesDesc = product.description.toLowerCase().includes(q);
      const matchesCategory = product.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesCategory) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low-to-high') {
      return a.price - b.price;
    }
    if (filters.sortBy === 'price-high-to-low') {
      return b.price - a.price;
    }
    if (filters.sortBy === 'customer-rating') {
      return b.rating - a.rating;
    }
    // Default recommended sorting looks at isTrending, isDealOfDay first
    const scoreA = (a.isTrending ? 2 : 0) + (a.isDealOfDay ? 1 : 0);
    const scoreB = (b.isTrending ? 2 : 0) + (b.isDealOfDay ? 1 : 0);
    return scoreB - scoreA;
  });

  // Admin CRUD Operations for full interactivity
  const addProduct = async (pData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct = await api.createProduct(pData);
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = async (updatedProd: Product) => {
    const saved = await api.updateProduct(updatedProd);
    setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addUser = async (uData: Omit<User, 'id' | 'joinedDate'>, password?: string): Promise<string | null> => {
    try {
      const newUser = await api.createUser({ ...uData, password });
      setUsers(prev => [newUser, ...prev]);
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Unable to create member.';
    }
  };

  const updateUser = async (updatedUser: User): Promise<string | null> => {
    try {
      const saved = await api.updateUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === saved.id ? saved : u));
      if (currentUser && currentUser.id === saved.id) {
        setCurrentUser(saved);
      }
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Unable to update member.';
    }
  };

  const deleteUser = async (id: string) => {
    await api.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser && currentUser.id === id) {
      logoutUser();
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const saved = await api.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: saved.status, paymentStatus: saved.paymentStatus } : o));
  };

  return (
    <AppContext.Provider value={{
      products,
      users,
      orders,
      cart,
      wishlist,
      currentUser,
      authLoading,
      filters,
      searchQuery,
      setSearchQuery,
      filteredProducts,
      currentView,
      selectedProductId,
      selectedOrderSuccess,
      navigateTo,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      clearOrderSuccess,
      loginAsUser,
      logoutUser,
      updateFilters,
      resetFilters,
      addProduct,
      updateProduct,
      deleteProduct,
      addUser,
      updateUser,
      deleteUser,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
