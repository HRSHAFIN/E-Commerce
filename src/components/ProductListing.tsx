import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Filter, X, ArrowUpDown, Star, RotateCcw, Search } from 'lucide-react';
import { BRANDS } from '../data';

export const ProductListing: React.FC = () => {
  const {
    filters,
    updateFilters,
    resetFilters,
    filteredProducts,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const priceRanges: { label: string; min: number; max: number }[] = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 to $150', min: 50, max: 150 },
    { label: '$150 to $250', min: 150, max: 250 },
    { label: '$250 and Over', min: 250, max: 500 }
  ];

  const ratingsOptions = [4.5, 4.0, 3.5];

  const handleBrandToggle = (brand: string) => {
    const active = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ brands: active });
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    if (filters.priceRange[0] === min && filters.priceRange[1] === max) {
      updateFilters({ priceRange: [0, 500] }); // Toggle back to all
    } else {
      updateFilters({ priceRange: [min, max] });
    }
  };

  const handleRatingSelect = (rating: number) => {
    updateFilters({ rating: filters.rating === rating ? null : rating });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-20 font-sans" id="plp-page">
      {/* Category banner background */}
      <div className="mb-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-white p-6 sm:p-10 relative overflow-hidden flex flex-col justify-center min-h-[140px] sm:min-h-[180px] shadow-sm select-none">
        <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 to-neutral-900/60 mix-blend-multiply z-0"></div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-semibold uppercase">
            CATALOGUE PRESTIGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            {filters.category === 'All' ? 'Curated Collection' : `${filters.category} Selection`}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-md">
            Uncompromised fashion accents and accessories built to elevate your stylistic signature.
          </p>
        </div>
      </div>

      {/* Primary search parameters for mobile */}
      <div className="md:hidden relative w-full mb-4">
        <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-white dark:bg-neutral-900/10 text-xs text-neutral-800 placeholder-neutral-400 rounded-xl pl-4 pr-10 py-3 border border-neutral-200 outline-none focus:border-amber-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-neutral-400"
            >
              <X size={14} />
            </button>
          )}
          <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        </form>
      </div>

      {/* Sorting bar & layout metrics indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 border-b border-neutral-100 mb-6 select-none">
        <div className="text-xs sm:text-sm text-neutral-500 font-medium">
          Showing <span className="font-bold text-neutral-950">{filteredProducts.length}</span> luxury items 
          {filters.search && (
            <span> for "<span className="text-amber-700 italic font-bold">{filters.search}</span>"</span>
          )}
        </div>

        {/* Sorting Dropdown + Filter Trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-white border border-neutral-200 rounded-xl text-neutral-700 shadow-sm active:scale-95 transition-all"
            id="mobile-filters-trigger"
          >
            <Filter size={14} />
            Filters
          </button>

          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 shadow-sm">
            <ArrowUpDown size={13} className="text-neutral-400 flex-shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="bg-transparent text-xs text-neutral-700 font-semibold outline-none border-none py-0.5 cursor-pointer"
              id="sorting-select"
            >
              <option value="recommended">Featured Recommended</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="customer-rating">Customer Star Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary content layout */}
      <div className="flex gap-8">
        
        {/* SIDEBAR FILTERS - Desktop only */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-6 select-none" id="desktop-filters-sidebar">
          {/* Header Reset Option */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-150">
            <span className="text-sm font-semibold text-neutral-900 tracking-wide">Refine Catalog</span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 duration-200 flex items-center gap-1.5"
              id="desktop-reset-filters-btn"
            >
              <RotateCcw size={11} />
              Reset All
            </button>
          </div>

          {/* Categories Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">Category</h4>
            <div className="flex flex-col gap-1.5">
              {['All', 'Men', 'Women', 'Kids', 'Accessories', 'Lifestyle'].map(cat => (
                <button
                  key={cat}
                  onClick={() => updateFilters({ category: cat })}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                    filters.category === cat
                      ? 'bg-amber-500/10 text-amber-800'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Selector ranges */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">Price Limit</h4>
            <div className="flex flex-col gap-1.5">
              {priceRanges.map((range, idx) => {
                const isActive = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePriceRangeSelect(range.min, range.max)}
                    className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-850'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand select parameters */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3">Brand</h4>
            <div className="flex flex-col gap-2.5">
              {BRANDS.map(brand => (
                <label key={brand} className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="h-3.5 w-3.5 rounded border-neutral-300 text-amber-600 focus:ring-amber-500/40 cursor-pointer"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Ratings parameters */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3">Customer Rating</h4>
            <div className="flex flex-col gap-2">
              {ratingsOptions.map(ratingVal => (
                <button
                  key={ratingVal}
                  onClick={() => handleRatingSelect(ratingVal)}
                  className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                    filters.rating === ratingVal
                      ? 'bg-amber-500/10 text-amber-800'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                  }`}
                >
                  <span className="flex items-center text-amber-500 gap-0.5">
                    <Star size={12} className="fill-current" />
                  </span>
                  <span>{ratingVal} & Above</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID SECTION */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center select-none" id="empty-plp-search">
              <div className="p-3 bg-neutral-100 rounded-full text-neutral-400 mb-4 animate-bounce">
                <RotateCcw size={28} />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-neutral-950">
                No luxurious pieces found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1 max-w-sm">
                Try loosening your filters, removing search keywords, or resetting to browse our entire seasonal catalog.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-full transition-all shadow-sm active:scale-95"
              >
                Reset Catalogue Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET OVERLAY FILTERS */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden flex flex-col justify-end">
          {/* Backdrop screen filter */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Main Bottom sheet card, scrolling content */}
          <div className="relative bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto flex flex-col p-6 shadow-2xl z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-sm font-bold text-neutral-900 tracking-wide flex items-center gap-2">
                <Filter size={15} />
                Refine Selection
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }}
                  className="text-xs font-semibold text-amber-700"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 bg-neutral-100 hover:bg-neutral-200 rounded-full"
                  title="Close filters"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content list */}
            <div className="space-y-5 pb-8">
              {/* Category selector */}
              <div>
                <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400 mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Men', 'Women', 'Kids', 'Accessories', 'Lifestyle'].map(cat => {
                    const active = filters.category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => updateFilters({ category: cat })}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                          active ? 'bg-amber-500/10 text-amber-800 border-amber-300' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Limits */}
              <div>
                <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400 mb-2">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range, idx) => {
                    const isActive = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePriceRangeSelect(range.min, range.max)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                          isActive ? 'bg-amber-500/10 text-amber-800 border-amber-300' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Selector */}
              <div>
                <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400 mb-2">Brand</h4>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map(brand => {
                    const isSelected = filters.brands.includes(brand);
                    return (
                      <button
                        key={brand}
                        onClick={() => handleBrandToggle(brand)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                          isSelected ? 'bg-amber-500/10 text-amber-800 border-amber-300' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400 mb-2">Customer Star Rating</h4>
                <div className="flex flex-wrap gap-2">
                  {ratingsOptions.map(ratingVal => {
                    const active = filters.rating === ratingVal;
                    return (
                      <button
                        key={ratingVal}
                        onClick={() => handleRatingSelect(ratingVal)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 transition-colors ${
                          active ? 'bg-amber-500/10 text-amber-800 border-amber-300' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{ratingVal} +</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-neutral-150">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-neutral-900 py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-md active:scale-95"
              >
                Apply Selected Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
