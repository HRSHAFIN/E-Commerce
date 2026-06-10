import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWishlist: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenWishlist }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartCount,
    navigateTo,
  } = useApp();

  if (!isOpen) return null;

  const handleProceedCheckout = () => {
    onClose();
    navigateTo('checkout');
  };

  const handleShopNow = () => {
    onClose();
    navigateTo('plp');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none font-sans" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Main Slide-out Container */}
      <div 
        className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-left border-l border-neutral-100"
        id="cart-drawer-container"
      >
        {/* Header toolbar */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-700 font-bold" />
            <span className="text-base font-serif font-bold text-neutral-950">Your Cart</span>
            <span className="text-xs bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">
              {cartCount} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 bg-neutral-100 hover:bg-neutral-200 rounded-full cursor-pointer transition-colors"
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Outer List Items Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-colors duration-200"
                id={`cart-item-row-${item.id}`}
              >
                {/* Product spec thumbnail */}
                <div 
                  onClick={() => { onClose(); navigateTo('pdp', item.product.id); }}
                  className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-150 flex-shrink-0 cursor-pointer"
                >
                  <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                </div>

                {/* Info and adjustments */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                      {item.product.brand}
                    </span>
                    <h4 
                      onClick={() => { onClose(); navigateTo('pdp', item.product.id); }}
                      className="text-xs font-semibold text-neutral-900 line-clamp-1 hover:text-amber-700 cursor-pointer transition-colors"
                    >
                      {item.product.title}
                    </h4>
                    
                    {/* Size and color details selection indicators */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-neutral-450 font-medium">
                      <span className="flex items-center gap-1">
                        Size: <span className="font-bold text-neutral-700">{item.selectedSize}</span>
                      </span>
                      <span className="text-neutral-300">|</span>
                      <span className="flex items-center gap-1.5">
                        Colour: 
                        <span 
                          style={{ backgroundColor: item.selectedColor.hex }} 
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" 
                          title={item.selectedColor.name}
                        />
                        <span className="font-bold text-neutral-700">{item.selectedColor.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity widgets and delete trigger row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-neutral-200 rounded-lg bg-white px-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-500 duration-150 text-xs w-5 text-center"
                        title="Reduce quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-mono font-bold px-1.5 text-neutral-800">{item.quantity}</span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-500 duration-150 text-xs w-5 text-center disabled:opacity-30"
                        title="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs sm:text-sm font-semibold font-mono text-neutral-900">
                        ${item.product.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                        id={`delete-cart-item-${item.id}`}
                        title="Delete product item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center" id="empty-cart-view">
              <ShoppingBag size={36} className="text-neutral-300 animate-pulse mb-3" />
              <h3 className="text-sm font-bold text-neutral-800">Your shopping cart is flat</h3>
              <p className="text-xs text-neutral-500 font-light mt-1 max-w-xs">Explore Aura store for necklaces, watches, leather totes and seasonal accessories.</p>
              <button
                onClick={handleShopNow}
                className="mt-6 bg-neutral-900 text-white text-xs font-semibold py-2.5 px-6 rounded-full"
              >
                Browse Seasonal Catalog
              </button>
            </div>
          )}
        </div>

        {/* Drawer footer computations and checkout buttons */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/70 space-y-4">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Subtotal Items</span>
                <span className="font-mono">${cartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>Delivery Courier</span>
                <span className="font-mono text-emerald-600 font-semibold">{cartTotal > 150 ? 'FREE' : '$15'}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-950 font-bold border-t border-dashed border-neutral-200 pt-2 text-sm sm:text-base">
                <span>Total Assessment</span>
                <span className="font-mono font-bold">${cartTotal > 150 ? cartTotal : cartTotal + 15}</span>
              </div>
            </div>

            {/* Quality badge disclaimer tag */}
            <div className="bg-white rounded-xl border border-neutral-200 px-3 py-2 flex items-center gap-2 text-[10px] sm:text-xs">
              <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
              <span className="text-neutral-500 font-light">Securely structured through Aura gateway with active 30-day coverage.</span>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow hover:shadow-md hover:scale-[1.01] active:scale-95 duration-200 flex items-center justify-center gap-2 leading-none"
              id="proceed-checkout-drawer-btn"
            >
              Proceed to Secure Checkout
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
