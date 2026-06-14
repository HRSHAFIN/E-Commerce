import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, ShoppingBag, User as UserIcon, Settings, X, ChevronDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenWishlist }) => {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    currentUser,
    navigateTo,
    updateFilters,
    products,
    currentView,
    filters,
  } = useApp();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Suggested keywords list based on active products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    
    // Find unique brands and titles
    const matched: string[] = [];
    products.forEach(p => {
      if (p.brand.toLowerCase().includes(query) && !matched.includes(p.brand)) {
        matched.push(p.brand);
      }
      if (p.title.toLowerCase().includes(query) && !matched.includes(p.title)) {
        // Keep it relatively short
        matched.push(p.title.split(' ').slice(0, 4).join(' '));
      }
    });
    
    // Fallback general categories
    const categories = ['gold', 'leather', 'denim', 'boots', 'accessories', 'fedora'];
    categories.forEach(cat => {
      if (cat.includes(query) && !matched.includes(cat)) {
        matched.push(cat);
      }
    });

    setSuggestions(matched.slice(0, 5));
  }, [searchQuery, products]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigateTo('plp');
  };

  const selectSuggestion = (phrase: string) => {
    setSearchQuery(phrase);
    setShowSuggestions(false);
    navigateTo('plp');
  };

  const handleCategoryClick = (category: string) => {
    updateFilters({ category });
    navigateTo('plp');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/75 border-b border-neutral-200/40 shadow-sm transition-all duration-300">
      {/* Top Banner Accent */}
      <div className="bg-neutral-900 text-[10px] sm:text-xs text-neutral-300 py-1.5 px-4 text-center select-none tracking-widest uppercase flex items-center justify-center gap-1.5 font-medium">
        <Sparkles size={11} className="text-amber-400 animate-pulse" />
        Enjoy complimentary express delivery on orders over $150
        <Sparkles size={11} className="text-amber-400 animate-pulse" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 cursor-pointer select-none group"
            id="site-logo"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 duration-300 group-hover:text-amber-600">
              AURA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-neutral-400 border border-neutral-300 group-hover:border-amber-500/50 group-hover:text-amber-500 rounded px-1 py-0.5 mt-1 ml-0.5 transition-all">
              STUDIO
            </span>
          </div>

          {/* Persistent Search Bar (Auto-Suggest UI) */}
          <div ref={dropdownRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium luxury fashion..."
                className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-sm text-neutral-800 placeholder-neutral-400 rounded-full pl-4 pr-10 py-2 border-none ring-1 ring-neutral-200/50 focus:ring-2 focus:ring-[#f59e0b] outline-none transition-all duration-200 font-sans shadow-sm"
                id="search-input"
              />
              {searchQuery ? (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
                >
                  <X size={14} />
                </button>
              ) : null}
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-800 rounded-full transition-colors"
                id="search-submit-btn"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Suggestions Portal */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-neutral-100 shadow-xl rounded-2xl p-2 z-50 animate-fade-in divide-y divide-neutral-50"
                id="search-suggestions-dropdown"
              >
                {suggestions.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(phrase)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 text-xs sm:text-sm text-neutral-700 flex items-center gap-3 transition-colors rounded-lg font-sans h-10"
                  >
                    <Search size={13} className="text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{phrase}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Icons Row */}
          <div className="flex items-center gap-3.5 sm:gap-4.5">
            {/* Quick Search mobile trigger */}
            <button 
              onClick={() => { updateFilters({ category: 'All' }); navigateTo('plp'); }}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 rounded-full md:hidden transition-colors"
              id="mobile-search-trigger"
              title="Search"
            >
              <Search size={19} />
            </button>

            {/* User Profile / Dashboard Switcher */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => navigateTo('profile')}
                className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'profile' ? 'bg-amber-500/15 text-amber-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50'}`}
                id="profile-trigger-btn"
                title="Profile & Activity"
              >
                <UserIcon size={19} />
                <span className="hidden lg:inline text-xs font-semibold tracking-wide">
                  {currentUser ? currentUser.fullName.split(' ')[0] : 'Guest'}
                </span>
              </button>

              {/* Show dedicated Admin settings toggle if current user is an admin */}
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator') ? (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`p-2 rounded-full transition-all relative ${currentView === 'admin' ? 'bg-orange-500/15 text-orange-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50'}`}
                  id="admin-dashboard-btn"
                  title="Admin Dashboard"
                >
                  <Settings size={19} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                </button>
              ) : null}
            </div>

            {/* Wishlist Icon with count badge if active */}
            <button 
              onClick={onOpenWishlist}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 rounded-full relative transition-all"
              id="wishlist-trigger-btn"
              title="Wishlist"
            >
              <Heart size={19} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon with badge count */}
            <button 
              onClick={onOpenCart}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 rounded-full relative transition-all"
              id="cart-trigger-btn"
              title="Shopping Cart"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white leading-none animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Sub-Header Navigation: Category Dropdowns for desktop */}
        <nav className="hidden md:flex items-center justify-center border-t border-neutral-200/30 py-2.5 space-x-8 text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-500 select-none">
          {['All', 'Men', 'Women', 'Kids', 'Accessories', 'Lifestyle'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`hover:text-neutral-900 cursor-pointer relative pb-1 transition-all font-mono text-[11px] sm:text-xs tracking-wider font-extrabold ${
                filters.category === cat 
                  ? 'text-neutral-950 border-b-2 border-[#f59e0b] pb-0.5' 
                  : 'text-neutral-500 hover:text-neutral-950 border-b-2 border-transparent pb-0.5'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
