import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, StoreFilters, Address, Color } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../data';

interface AppContextType {
  products: Product[];
  users: User[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: User | null;
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
  placeOrder: (address: Address, paymentMethod: string) => Order | null;
  clearOrderSuccess: () => void;
  
  // Authentication Actions
  loginAsUser: (email: string) => void;
  logoutUser: () => void;
  
  // Filter Actions
  updateFilters: (updates: Partial<StoreFilters>) => void;
  resetFilters: () => void;
  
  // Admin Operations (CRUD)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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
  // Load initial state or local storage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('aura_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aura_current_user');
    // Default to the admin user: Hasibur Shafin for seamless inspection of the Admin Dashboard
    if (saved) return JSON.parse(saved);
    const admin = INITIAL_USERS.find(u => u.role === 'admin');
    return admin || INITIAL_USERS[0];
  });

  const [filters, setFilters] = useState<StoreFilters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<AppContextType['currentView']>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderSuccess, setSelectedOrderSuccess] = useState<Order | null>(null);

  // Sync state to local storage when changed
  useEffect(() => {
    localStorage.setItem('aura_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aura_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_current_user');
    }
  }, [currentUser]);

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
  const placeOrder = (address: Address, paymentMethod: string): Order | null => {
    if (cart.length === 0) return null;

    const subtotal = cartTotal;
    const discount = subtotal > 200 ? 30 : subtotal > 100 ? 15 : 0;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const deliveryFee = subtotal > 150 ? 0 : 15;
    const total = Number((subtotal - discount + tax + deliveryFee).toFixed(2));

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount,
      tax,
      deliveryFee,
      total,
      address,
      status: 'Pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      customerEmail: currentUser?.email || 'guest@example.com'
    };

    // Update stock levels
    setProducts(prevProducts => 
      prevProducts.map(p => {
        const cartItemsForProduct = cart.filter(item => item.product.id === p.id);
        if (cartItemsForProduct.length > 0) {
          const totalQtyPurchased = cartItemsForProduct.reduce((acc, item) => acc + item.quantity, 0);
          return { ...p, stock: Math.max(0, p.stock - totalQtyPurchased) };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderSuccess(newOrder);
    clearCart();
    return newOrder;
  };

  const clearOrderSuccess = () => {
    setSelectedOrderSuccess(null);
  };

  // Auth Operations
  const loginAsUser = (email: string) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      // Create lightweight guest profile
      const [namePrefix] = email.split('@');
      const formattedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        fullName: formattedName,
        role: 'customer',
        isActive: true,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
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
  const addProduct = (pData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...pData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addUser = (uData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...uData,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, paymentStatus: status === 'Delivered' ? 'Paid' : o.paymentStatus } : o));
  };

  return (
    <AppContext.Provider value={{
      products,
      users,
      orders,
      cart,
      wishlist,
      currentUser,
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
