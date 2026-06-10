import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Heart, ShoppingCart } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCartDirect: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, onAddToCartDirect }) => {
  const {
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    navigateTo,
  } = useApp();

  if (!isOpen) return null;

  // Filter corresponding products
  const savedItems = products.filter(p => wishlist.includes(p.id));

  const handleQuickAdd = (productId: string) => {
    const item = products.find(p => p.id === productId);
    if (!item) return;

    const size = item.sizes[0] || 'Standard';
    const color = item.colors[0] || { name: 'Default', hex: '#000000' };
    addToCart(item, 1, size, color);
    toggleWishlist(productId); // Remove from wishlist when added to cart
    onAddToCartDirect(); // This will open the cart drawer!
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none font-sans" id="wishlist-drawer-overlay">
      {/* Backdrop screen filter */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/45 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide Container card */}
      <div 
        className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-left border-l border-neutral-100"
        id="wishlist-drawer-container"
      >
        {/* Header Toolbar */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500 fill-rose-500 font-bold" />
            <span className="text-base font-serif font-bold text-neutral-950">Your Wishlist</span>
            <span className="text-xs bg-rose-500/10 text-rose-805 px-2 py-0.5 rounded-full font-mono font-bold">
              {savedItems.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-450 bg-neutral-100 hover:bg-neutral-200 rounded-full cursor-pointer transition-colors"
            title="Close wishlist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {savedItems.length > 0 ? (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white hover:bg-neutral-50/50 border border-neutral-200/60 rounded-2xl transition-colors duration-250 items-center"
              >
                {/* Product thumbnail preview */}
                <div 
                  onClick={() => { onClose(); navigateTo('pdp', item.id); }}
                  className="w-14 h-18 rounded-xl overflow-hidden bg-neutral-150 flex-shrink-0 cursor-pointer"
                >
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Detail layouts info */}
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-450 block">
                    {item.brand}
                  </span>
                  <h4 
                    onClick={() => { onClose(); navigateTo('pdp', item.id); }}
                    className="text-xs font-semibold text-neutral-900 line-clamp-1 hover:text-amber-700 cursor-pointer transition-colors"
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-neutral-950">${item.price}</span>
                    {item.discountPercent > 0 && (
                      <span className="text-[10px] text-neutral-400 line-through font-mono">${item.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Utilities buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleQuickAdd(item.id)}
                    className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-sm shadow-amber-600/10 active:scale-90"
                    title="Move item to active shopping cart"
                  >
                    <ShoppingCart size={13} />
                  </button>
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors duration-200"
                    title="Remove item from Wishlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Heart size={36} className="text-neutral-200 mb-3" />
              <h3 className="text-sm font-bold text-neutral-800">Your wishlist is empty</h3>
              <p className="text-xs text-neutral-500 font-light mt-1 max-w-xs">Double tap the heart icon on any accessory image in our store to save items for later.</p>
              <button
                onClick={() => { onClose(); navigateTo('plp'); }}
                className="mt-6 bg-neutral-900 text-white text-xs font-semibold py-2.5 px-6 rounded-full"
              >
                Browse Seasonal Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
