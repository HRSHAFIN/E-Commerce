import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Filter, ShoppingBag, User, ShieldAlert } from 'lucide-react';

interface BottomNavBarProps {
  onOpenCart: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenCart }) => {
  const { currentView, navigateTo, cartCount, updateFilters, currentUser } = useApp();

  const handleCategoriesClick = () => {
    updateFilters({ category: 'All' });
    navigateTo('plp');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 pointer-events-none">
      <nav 
        className="mx-auto w-full max-w-md pointer-events-auto bg-black/95 backdrop-blur-xl border border-gray-800 rounded-full py-2.5 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-around text-gray-400"
        id="mobile-bottom-navbar"
      >
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-200 active:scale-90 ${currentView === 'home' ? 'text-[#f59e0b]' : 'text-gray-500 hover:text-white'}`}
          id="mobile-nav-home"
          title="Home"
        >
          <Home size={19} />
          <span className="text-[9px] font-bold tracking-wider mt-0.5">Home</span>
        </button>

        {/* Categories / PLP */}
        <button
          onClick={handleCategoriesClick}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-200 active:scale-90 ${currentView === 'plp' ? 'text-[#f59e0b]' : 'text-gray-500 hover:text-white'}`}
          id="mobile-nav-categories"
          title="Categories"
        >
          <Filter size={19} />
          <span className="text-[9px] font-bold tracking-wider mt-0.5">Shop</span>
        </button>

        {/* Cart Drawer Click */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center p-2 rounded-full relative duration-200 active:scale-90 text-gray-500 hover:text-white"
          id="mobile-nav-cart"
          title="Cart"
        >
          <div className="relative">
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f59e0b] text-[8px] font-black text-black">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold tracking-wider mt-0.5">Cart</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigateTo('profile')}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-200 active:scale-90 ${currentView === 'profile' ? 'text-[#f59e0b]' : 'text-gray-500 hover:text-white'}`}
          id="mobile-nav-profile"
          title="Profile"
        >
          <User size={19} />
          <span className="text-[9px] font-bold tracking-wider mt-0.5">Profile</span>
        </button>

        {/* Dedicated Admin Panel Trigger if user has admin privileges */}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator') ? (
          <button
            onClick={() => navigateTo('admin')}
            className={`flex flex-col items-center justify-center p-2 rounded-full duration-200 active:scale-90 ${currentView === 'admin' ? 'text-[#f59e0b]' : 'text-gray-500 hover:text-white'}`}
            id="mobile-nav-admin"
            title="Admin"
          >
            <ShieldAlert size={19} />
            <span className="text-[9px] font-bold tracking-wider mt-0.5">Admin</span>
          </button>
        ) : null}
      </nav>
    </div>
  );
};
