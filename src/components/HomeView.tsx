import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroCarousel } from './HeroCarousel';
import { QuickCategories } from './QuickCategories';
import { ProductCard } from './ProductCard';
import { Sparkles, Hourglass, History, Flame, ArrowRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, navigateTo, updateFilters } = useApp();

  // Curated lists
  const trendingProducts = products.filter(p => p.isTrending);
  const dealProducts = products.filter(p => p.isDealOfDay);
  const recentlyViewedProducts = products.filter(p => p.recentlyViewed);

  const handleSeeAll = (category?: string) => {
    updateFilters({ category: category || 'All' });
    navigateTo('plp');
  };

  return (
    <div className="space-y-12 pb-24 font-sans select-none" id="home-view-container">
      
      {/* 1. HERO CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <HeroCarousel />
      </section>

      {/* 2. CIRCULAR QUICK CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <QuickCategories />
      </section>

      {/* 3. TRENDING NOW SECTION - Horizontal Scroll */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg">
              <Flame size={16} className="animate-pulse" />
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-wider text-[#111827]">
              Trending Now
            </h2>
          </div>
          <button
            onClick={() => handleSeeAll('All')}
            className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors uppercase tracking-widest"
          >
            See All Items
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Horizontal Card Row list wrapper */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1 -mx-1">
          {trendingProducts.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. DEAL OF THE DAY SECTION - Horizontal Scroll */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg">
              <Hourglass size={16} />
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-wider text-[#111827]">
              Deal of the Day
            </h2>
          </div>
          <button
            onClick={() => handleSeeAll('Accessories')}
            className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors uppercase tracking-widest"
          >
            See Luxury Deals
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Horizontal Deals cards row list wrapper */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1 -mx-1">
          {dealProducts.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. BRAND PROMO HIGHLIGHT BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-black border border-gray-800 text-white p-6 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          {/* Subtle patterns overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-amber-700/10 to-transparent mix-blend-multiply z-0"></div>
          
          <div className="relative z-10 space-y-2 text-center sm:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#f59e0b] font-semibold uppercase">
              <Sparkles size={11} className="animate-pulse" />
              MEMBERSHIP ADVANTAGE
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight">
              Join the Elite Aura Circle
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Unlock complementary luxury parcel deliveries on all orders, private reservations for seasonal capsule launches, and dynamic 30% reduction coupons.
            </p>
          </div>

          <button
            onClick={() => navigateTo('profile')}
            className="relative z-10 bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-full shrink-0 active:scale-95 transition-all duration-300 shadow-lg shadow-amber-500/20"
            id="register-member-promo-btn"
          >
            Register Profile Immediately
          </button>
        </div>
      </section>

      {/* 6. RECENTLY VIEWED SECTION - Horizontal Scroll (Displays if items viewed) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#111827]/5 border border-[#111827]/10 text-neutral-800 rounded-lg">
                <History size={16} />
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-wider text-[#111827]">
                Recently Viewed
              </h2>
            </div>
            <button
              onClick={() => handleSeeAll('All')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 transition-colors uppercase tracking-widest"
            >
              Clear Records
            </button>
          </div>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1 -mx-1">
            {recentlyViewedProducts.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
