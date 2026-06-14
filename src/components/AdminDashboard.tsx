import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, User, Order } from '../types';
import { 
  Users, ShoppingCart, DollarSign, TrendingUp, Plus, Edit, Trash2, 
  Search, ShieldAlert, Package, Settings, BarChart3, AlertCircle, Sparkles, Check, Play 
} from 'lucide-react';
import { BRANDS } from '../data';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    users,
    orders,
    currentUser,
    loginAsUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addUser,
    updateUser,
    deleteUser,
    updateOrderStatus
  } = useApp();

  // Authentication barrier: Admins & Moderators may access the control center
  const isAuthorized = currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator');
  const isAdmin = currentUser?.role === 'admin';

  const [bypassLoading, setBypassLoading] = useState(false);
  const [bypassError, setBypassError] = useState('');

  const handleBypassLogin = async () => {
    setBypassLoading(true);
    const error = await loginAsUser('hasiburshafin@gmail.com', 'password123');
    setBypassLoading(false);
    if (error) setBypassError(error);
  };

  // Sub-tab tracking
  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders' | 'users' | 'settings'>('analytics');

  // Search parameters for lists
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'All' | Order['status']>('All');

  // Modal / Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Initial Product Form Template
  const [productForm, setProductForm] = useState<Omit<Product, 'id' | 'rating' | 'reviewCount'>>({
    title: '',
    description: '',
    price: 99,
    originalPrice: 150,
    discountPercent: 34,
    category: 'Accessories',
    brand: 'Aura',
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800'],
    sizes: ['Standard'],
    colors: [{ name: 'Default Black', hex: '#000000' }],
    stock: 20
  });

  // Initial User Form Template
  const [userForm, setUserForm] = useState<Omit<User, 'id' | 'joinedDate'>>({
    email: '',
    fullName: '',
    role: 'customer',
    isActive: true
  });
  const [newUserPassword, setNewUserPassword] = useState('');

  const [productFormError, setProductFormError] = useState('');
  const [userFormError, setUserFormError] = useState('');

  // Site Configurations settings representational state
  const [siteSettings, setSiteSettings] = useState({
    promoBannerActive: true,
    promoText: 'Aura Premium Members - Enjoy complimentary express courier delivery on transactions over $150',
    freeShippingThreshold: 150,
    activeCouponCode: 'AURA_COMP50',
    sandboxPaymentMode: true
  });

  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center select-none font-sans" id="admin-access-denied">
        <div className="inline-flex p-3 bg-rose-500/10 border border-rose-300/40 rounded-full text-rose-600 mb-5 animate-pulse">
          <ShieldAlert size={48} className="stroke-2" />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 tracking-tight">Executive Authentication Required</h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1 max-w-sm mx-auto">
          The module you are attempting to review contains secure corporate analytics. Access is strictly constrained to authorized administrators.
        </p>

        <div className="mt-8 p-5 bg-neutral-50/70 border border-neutral-150 rounded-2xl text-left space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <AlertCircle size={14} className="text-amber-500" />
            <span>Interactive Demo Quick Bypass:</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            Click the button below to log in immediately as <strong className="text-neutral-850">Hasibur Shafin (hasiburshafin@gmail.com)</strong>, the prefilled administrative profiles coordinator.
          </p>
          <button
            onClick={handleBypassLogin}
            disabled={bypassLoading}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase py-2.5 rounded-xl duration-200 active:scale-95 disabled:opacity-50"
            id="admin-quick-bypass-login"
          >
            {bypassLoading ? 'Authenticating…' : 'Authenticate Authorized Admin Profile'}
          </button>
          {bypassError && <p className="text-[11px] text-rose-500 font-bold">{bypassError}</p>}
        </div>
      </div>
    );
  }

  // Cost Aggregations computations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);

  const averageOrderValue = orders.length > 0
    ? Number((totalRevenue / orders.length).toFixed(2))
    : 0;

  const lowStockProductsCount = products.filter(p => p.stock <= 5).length;

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError('');
    try {
      if (editingProduct) {
        await updateProduct({
          ...editingProduct,
          ...productForm
        });
      } else {
        await addProduct(productForm);
      }
    } catch (err) {
      setProductFormError(err instanceof Error ? err.message : 'Unable to save product.');
      return;
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    // Reset form
    setProductForm({
      title: '',
      description: '',
      price: 99,
      originalPrice: 150,
      discountPercent: 34,
      category: 'Accessories',
      brand: 'Aura',
      images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800'],
      sizes: ['Standard'],
      colors: [{ name: 'Default Black', hex: '#000000' }],
      stock: 20
    });
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    const error = editingUser
      ? await updateUser({ ...editingUser, ...userForm })
      : await addUser(userForm, newUserPassword || undefined);

    if (error) {
      setUserFormError(error);
      return;
    }

    setIsUserModalOpen(false);
    setEditingUser(null);
    // Reset Form
    setUserForm({
      email: '',
      fullName: '',
      role: 'customer',
      isActive: true
    });
    setNewUserPassword('');
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice,
      discountPercent: prod.discountPercent,
      category: prod.category,
      brand: prod.brand,
      images: prod.images,
      sizes: prod.sizes,
      colors: prod.colors,
      stock: prod.stock
    });
    setIsProductModalOpen(true);
  };

  const openEditUserModal = (u: User) => {
    setEditingUser(u);
    setUserForm({
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      isActive: u.isActive
    });
    setIsUserModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-32 font-sans" id="admin-dashboard-page">
      {/* Header Accent tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-orange-600 bg-orange-500/10 px-2.5 py-0.5 rounded-full font-bold uppercase">
              ADMIN CONTROL CENTER
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 tracking-tight">Platform Corporate Operations</h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light">centralized interface for managing users, tracking orders, editing catalogs, and evaluating revenue margins.</p>
        </div>

        {/* Action tags buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            id="admin-add-product-btn"
          >
            <Plus size={14} />
            Product
          </button>
          {isAdmin && (
            <button
              onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <Plus size={14} />
              User Member
            </button>
          )}
        </div>
      </div>

      {/* HORIZONTAL GLASS SUB TAB NAVIGATION */}
      <div className="border border-neutral-200 bg-white rounded-2xl p-1.5 mb-8 flex flex-wrap gap-1.5 shadow-sm select-none">
        {[
          { key: 'analytics', label: 'Overview Analytics', icon: BarChart3 },
          { key: 'products', label: 'Product Catalog', icon: Package },
          { key: 'orders', label: 'Fulfill Orders', icon: ShoppingCart },
          ...(isAdmin ? [{ key: 'users', label: 'Member Directory', icon: Users }] : []),
          ...(isAdmin ? [{ key: 'settings', label: 'General Configurations', icon: Settings }] : [])
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = adminTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key as any)}
              className={`flex-1 min-w-[140px] text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all outline-none ${
                isActive 
                  ? 'bg-neutral-905 bg-neutral-900 text-white shadow-md font-bold' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50'
              }`}
            >
              <IconComponent size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB PANELS RENDERING */}

      {/* 1. ANALYTICS HUB PANEL */}
      {adminTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in" id="admin-panel-analytics">
          
          {/* Bento stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Aggregate settled sales */}
            <div className="bg-white border border-neutral-200/60 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-neutral-450">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Total Settled Sales</span>
                <DollarSign size={16} className="text-emerald-500" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">${totalRevenue.toFixed(2)}</span>
                <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp size={10} /> +12.4% over past week
                </p>
              </div>
            </div>

            {/* Total orders placed */}
            <div className="bg-white border border-neutral-200/60 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-neutral-450">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Invoices Booked</span>
                <ShoppingCart size={16} className="text-amber-500" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">{orders.length}</span>
                <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp size={10} /> +8.2% conversion rate
                </p>
              </div>
            </div>

            {/* Total registered directory */}
            <div className="bg-white border border-neutral-200/60 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-neutral-450">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Accredited Members</span>
                <Users size={16} className="text-blue-500" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">{users.length}</span>
                <p className="text-[10px] text-neutral-500 mt-1 font-medium">
                  {users.filter(u => u.isActive).length} active directories
                </p>
              </div>
            </div>

            {/* Average order value */}
            <div className="bg-white border border-neutral-200/60 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between text-neutral-450">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Average Booking Val</span>
                <TrendingUp size={16} className="text-indigo-500" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">${averageOrderValue}</span>
                <p className="text-[10px] text-amber-600 mt-1 font-medium font-mono text-emerald-600">
                  {lowStockProductsCount} products low stock
                </p>
              </div>
            </div>

          </div>

          {/* Core Analytics row (Graphical estimations + Top Accessories) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Chart mockup */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-neutral-905">Revenue Outset Cycles</h3>
                  <p className="text-[10px] text-neutral-400 font-light">Daily high-frequency transactions metrics</p>
                </div>
                {/* Duration select mock picker */}
                <select className="border border-neutral-200 text-[10px] rounded px-2.5 py-1 text-neutral-500 outline-none">
                  <option>Last 7 Cycles</option>
                  <option>Previous Quarter</option>
                </select>
              </div>

              {/* Pure CSS Render of beautiful bar charts */}
              <div className="h-56 flex items-end justify-between gap-4 pt-4 px-2 select-none">
                {[
                  { label: 'Mon', value: 349, height: 'h-[35%]' },
                  { label: 'Tue', value: 520, height: 'h-[50%]' },
                  { label: 'Wed', value: 119, height: 'h-[15%]' },
                  { label: 'Thu', value: 780, height: 'h-[80%]' },
                  { label: 'Fri', value: 940, height: 'h-[95%]' },
                  { label: 'Sat', value: 430, height: 'h-[45%]' },
                  { label: 'Sun', value: 680, height: 'h-[70%]' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    {/* Floating Value Banner */}
                    <span className="opacity-0 group-hover:opacity-100 duration-200 transition-opacity bg-neutral-900 text-white text-[9px] font-mono px-1 py-0.5 rounded mb-0.5">
                      ${bar.value}
                    </span>
                    <div className={`w-full rounded-md bg-neutral-100 group-hover:bg-amber-600 transition-colors ${bar.height}`} />
                    <span className="text-[10px] font-mono text-neutral-400">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top accessories table */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-neutral-905">Top Curation Accents</h3>
                <p className="text-[10px] text-neutral-400 font-light">Highest-frequency requested fashion pieces</p>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                {products.slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="font-mono font-bold text-neutral-300 w-4">{idx + 1}</span>
                    <img src={p.images[0]} alt={p.title} className="w-9 h-11 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-neutral-900 block truncate">{p.title}</span>
                      <span className="text-[10px] text-neutral-450 block font-mono">{p.brand} — {p.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900 block font-mono">${p.price}</span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">{p.stock} units left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. PRODUCT CATALOG MANAGEMENT PANEL */}
      {adminTab === 'products' && (
        <div className="space-y-4 animate-fade-in" id="admin-panel-products">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Query product catalog..."
                className="w-full bg-white text-xs border border-neutral-200 pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-amber-500 text-neutral-800"
              />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs select-none">
                <thead className="bg-neutral-55 bg-neutral-50 text-neutral-500 font-mono tracking-wider uppercase font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-4 pl-6">Accessory Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Limit</th>
                    <th className="p-4 text-right pr-6">Manage Utilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {products
                    .filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()))
                    .map(p => (
                      <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-12 rounded object-cover flex-shrink-0" />
                          <div>
                            <span className="font-extrabold text-neutral-900 block">{p.title}</span>
                            <span className="text-[10px] text-neutral-400 block font-mono">ID: {p.id} | {p.brand}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-neutral-800">{p.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-neutral-900 font-mono">${p.price}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-[10px] text-neutral-400 line-through block font-mono">${p.originalPrice}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${p.stock <= 5 ? 'text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded' : 'text-neutral-500'}`}>
                            {p.stock} items
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-1">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 text-neutral-400 hover:text-amber-700 hover:bg-amber-50 rounded"
                            title="Edit product specs"
                          >
                            <Edit size={13} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => deleteProduct(p.id).catch(err => alert(err instanceof Error ? err.message : 'Failed to delete product'))}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete product piece"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER FULFILLMENT CENTER PANEL */}
      {adminTab === 'orders' && (
        <div className="space-y-4 animate-fade-in" id="admin-panel-orders">
          {/* Status filters toggles */}
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setOrderFilter(status as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  orderFilter === status
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs select-none">
                <thead className="bg-neutral-50 text-neutral-500 font-mono tracking-wider uppercase font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-4 pl-6">Invoice ID</th>
                    <th className="p-4">Buyer Customer</th>
                    <th className="p-4">Address Coordinates</th>
                    <th className="p-4">Costs settles</th>
                    <th className="p-4">Fulfillment State</th>
                    <th className="p-4 text-right pr-6">Cycle Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-750">
                  {orders
                    .filter(o => orderFilter === 'All' || o.status === orderFilter)
                    .map(o => (
                      <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <span className="font-extrabold text-neutral-900 font-mono block">{o.id}</span>
                          <span className="text-[10px] text-neutral-450 block">{new Date(o.date).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-neutral-900 block">{o.address.fullName}</span>
                          <span className="text-[10px] text-neutral-450 block truncate max-w-[150px]">{o.customerEmail}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-neutral-700 block truncate max-w-[180px]">{o.address.addressLine}</span>
                          <span className="text-[10px] text-neutral-400 block">{o.address.city}, {o.address.country}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-neutral-900">
                          ${o.total}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-800' :
                            o.status === 'Shipped' ? 'bg-amber-500/10 text-amber-850' : 'bg-orange-500/10 text-orange-850'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          {/* Selector to change status */}
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as any).catch(err => alert(err instanceof Error ? err.message : 'Failed to update order'))}
                            className="bg-neutral-50 border border-neutral-200 text-[10px] rounded px-2 py-1 font-semibold cursor-pointer text-neutral-700 outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. MEMBER DATABASE DIRECTORY PANEL */}
      {adminTab === 'users' && (
        <div className="space-y-4 animate-fade-in" id="admin-panel-users">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Query customer directory..."
              className="w-full bg-white text-xs border border-neutral-200 pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-amber-500 text-neutral-800"
            />
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs select-none">
                <thead className="bg-neutral-55 bg-neutral-50 text-neutral-500 font-mono tracking-wider uppercase font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-4 pl-6">Profile Email</th>
                    <th className="p-4">Name Mapping</th>
                    <th className="p-4">Access privileges</th>
                    <th className="p-4">Verification status</th>
                    <th className="p-4 text-right pr-6">Member Utilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-750">
                  {users
                    .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.fullName.toLowerCase().includes(userSearch.toLowerCase()))
                    .map(u => (
                      <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-neutral-900">
                          {u.email}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-neutral-800">{u.fullName}</span>
                          <span className="text-[10px] text-neutral-400 block">Joined: {u.joinedDate}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-orange-500/10 text-orange-800' :
                            u.role === 'moderator' ? 'bg-blue-500/10 text-blue-800' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`h-2.5 w-2.5 rounded-full inline-block mr-1.5 ${u.isActive ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                          <span className="font-semibold">{u.isActive ? 'Active' : 'Deactivated'}</span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-1">
                          <button
                            onClick={() => openEditUserModal(u)}
                            className="p-1.5 text-neutral-400 hover:text-amber-700 hover:bg-amber-50 rounded"
                            title="Edit member specifications"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => deleteUser(u.id).catch(err => alert(err instanceof Error ? err.message : 'Failed to delete user'))}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Purge member directory"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SITE CONFIGURATIONS PANEL */}
      {adminTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm animate-fade-in" id="admin-panel-settings">
          {/* Promos */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-905 border-b border-neutral-100 pb-3 font-mono uppercase">Promotional Layout Banner</h3>
            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteSettings.promoBannerActive}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, promoBannerActive: e.target.checked }))}
                  className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="font-semibold text-neutral-700">Display Carousel Promotional Ribbon bar</span>
              </label>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600 block">Ribbon Text Message</label>
                <textarea
                  rows={2}
                  value={siteSettings.promoText}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, promoText: e.target.value }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-505 focus:border-amber-500 text-neutral-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Pricing gate limits */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-905 border-b border-neutral-100 pb-3 font-mono uppercase">Deliveries Shipping Rates</h3>
            <div className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-neutral-600 block">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={siteSettings.freeShippingThreshold}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800 font-mono"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-neutral-600 block">Store coupon descriptor active</label>
                <input
                  type="text"
                  value={siteSettings.activeCouponCode}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, activeCouponCode: e.target.value }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-850 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL OVERLAYS (PRODUCT & USER ADD/EDIT FOR INTERACTIVITY)
          ======================================================== */}

      {/* PRODUCT ADMIN MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsProductModalOpen(false)} className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs" />
          
          <form 
            onSubmit={handleProductFormSubmit}
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl z-10 space-y-5 flex flex-col text-xs"
            id="admin-product-form"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">{editingProduct ? 'Modify Curation Item Specifications' : 'Catalog New Premium Accessory'}</h3>
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="font-semibold text-neutral-600">Accessory Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Gilded Pearl Collar Necklace"
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 text-neutral-850 font-semibold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="font-semibold text-neutral-600">Description Narrative</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your authentic experience with materials..."
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 text-neutral-850"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600">Calculated Store Price ($)</label>
                <input
                  type="number"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-mono"
                />
              </div>

              {/* Original Price */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600">Original Price ($)</label>
                <input
                  type="number"
                  required
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-mono"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600 font-sans">Selector Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-semibold cursor-pointer"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* Brand */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600 font-sans">Brand Coordinator</label>
                <select
                  value={productForm.brand}
                  onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-semibold cursor-pointer"
                >
                  {BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600">Starting Stock Unit</label>
                <input
                  type="number"
                  required
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-mono"
                />
              </div>

              {/* Thumbnail URL Image */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600">Unsplash Visual URL Link</label>
                <input
                  type="text"
                  required
                  value={productForm.images[0]}
                  onChange={(e) => setProductForm(prev => ({ ...prev, images: [e.target.value] }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 truncate"
                />
              </div>
            </div>

            {productFormError && <p className="text-[11px] text-rose-500 font-bold">{productFormError}</p>}

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md mt-4 uppercase tracking-widest font-mono text-[10px]"
              id="admin-product-submit"
            >
              {editingProduct ? 'Commit Modification changes' : 'Publish Catalog Item'}
            </button>
          </form>
        </div>
      )}

      {/* MEMBER LIST EDIT MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsUserModalOpen(false)} className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs" />
          
          <form 
            onSubmit={handleUserFormSubmit}
            className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl z-10 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="text-sm font-bold text-neutral-900">{editingUser ? 'Edit Member details' : 'Accredit New Directory Member'}</h3>
              <button type="button" onClick={() => setIsUserModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">Close</button>
            </div>

            <div className="space-y-3">
              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600 block">Corporate / Personal Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="coordination@lifestyle.com"
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-mono text-neutral-800"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-600 block">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.fullName}
                  onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-semibold text-neutral-800"
                />
              </div>

              {/* Password (new members only) */}
              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-600 block">Initial Password</label>
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Defaults to password123 if left blank"
                    className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-mono text-neutral-800"
                  />
                </div>
              )}

              {/* privileges privilege */}
              <div className="space-y-1.5 font-sans">
                <label className="font-semibold text-neutral-600 block font-sans">Corporate role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full bg-white border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-bold"
                >
                  <option value="customer">Customer Access</option>
                  <option value="moderator">Moderator Access</option>
                  <option value="admin">Platform authorized Admin</option>
                </select>
              </div>

              {/* Status active */}
              <label className="flex items-center gap-3 cursor-pointer select-none pt-2 font-semibold">
                <input
                  type="checkbox"
                  checked={userForm.isActive}
                  onChange={(e) => setUserForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span>Set Directory Status Active</span>
              </label>
            </div>

            {userFormError && <p className="text-[11px] text-rose-500 font-bold">{userFormError}</p>}

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md mt-4 uppercase font-mono tracking-widest text-[10px]"
            >
              Confirm and Commit
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
