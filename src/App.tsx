import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './components/HomeView';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutFlow } from './components/CheckoutFlow';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileView } from './components/ProfileView';

// Inner orchestrator content utilizing AppContext
const AppContent: React.FC = () => {
  const { currentView, navigateTo } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans relative overflow-x-hidden pt-0 selection:bg-amber-200">
      
      {/* 1. STICKY TOP ACCENT HEADER */}
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenWishlist={() => setIsWishlistOpen(true)} 
      />

      {/* 2. CENTRAL INTERACTIVE VIEW ROUTER */}
      <main className="flex-1 w-full relative z-0">
        {currentView === 'home' && <HomeView />}
        {currentView === 'plp' && <ProductListing />}
        {currentView === 'pdp' && <ProductDetail />}
        {currentView === 'checkout' && <CheckoutFlow />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* 3. SLIDING RIGHT DRAWER CARTS PORTALS */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onOpenWishlist={() => {
          setIsCartOpen(false);
          setIsWishlistOpen(true);
        }}
      />

      <WishlistDrawer 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
        onAddToCartDirect={() => {
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* 4. DESIGNER PLATFORM FOOTER */}
      <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 tracking-wide font-sans select-none pb-24 md:pb-12 text-xs">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <span className="font-serif text-lg font-bold text-white tracking-widest uppercase">AURA STORE</span>
            <p className="text-neutral-400 leading-relaxed font-light">
              Premium curated fashion, accessories, and lifestyle accoutrements built to celebrate and refine your spatial style. Crafted for uncompromised elegance.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white font-mono uppercase tracking-widest text-[10px]">E-Commerce Directory</h4>
            <div className="flex flex-col gap-2 font-medium text-neutral-400">
              <button onClick={() => navigateTo('plp')} className="text-left hover:text-white transition-colors duration-200">Men Accessories</button>
              <button onClick={() => navigateTo('plp')} className="text-left hover:text-white transition-colors duration-200">Women Leatherware</button>
              <button onClick={() => navigateTo('plp')} className="text-left hover:text-white transition-colors duration-200">Premium Timepieces</button>
              <button onClick={() => navigateTo('plp')} className="text-left hover:text-white transition-colors duration-200">Micro-Capsule collections</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white font-mono uppercase tracking-widest text-[10px]">Aura Operations</h4>
            <div className="flex flex-col gap-2 font-medium text-neutral-400">
              <button onClick={() => navigateTo('profile')} className="text-left hover:text-white transition-colors duration-200">Order Delivery Tracker</button>
              <button onClick={() => navigateTo('profile')} className="text-left hover:text-white transition-colors duration-200">My Saved Wishlist</button>
              <button onClick={() => navigateTo('admin')} className="text-left hover:text-white transition-colors duration-200">Corporate Portal Panel</button>
              <p className="font-light">Support Hotline: support@aurastore.vogue</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white font-mono uppercase tracking-widest text-[10px]">Accreditation Guarantee</h4>
            <p className="text-neutral-400 leading-relaxed font-light">
              We leverage authenticated 316L gold and Italian calfskin saffiano leather, backed by certifications from European artisanal confederations.
            </p>
          </div>

        </div>

        <div className="mx-auto max-w-7xl pt-8 mt-8 border-t border-neutral-800 text-center text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] sm:text-xs">
          <p>© 2026 Aura Fashion & Lifestyle Store. All privileges protected.</p>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>Security Certified</span>
            <span>·</span>
            <span>SSL Secured</span>
          </div>
        </div>
      </footer>

      {/* 5. STICKY MOBILE BOTTOM BAR BUTTONS */}
      <BottomNavBar onOpenCart={() => setIsCartOpen(true)} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
