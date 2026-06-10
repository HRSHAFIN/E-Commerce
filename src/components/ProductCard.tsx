import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, toggleWishlist, isInWishlist, addToCart } = useApp();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering navigation to PDP
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to the first available size and color
    const size = product.sizes[0] || 'Standard';
    const color = product.colors[0] || { name: 'Default', hex: '#4B3621' };
    addToCart(product, 1, size, color);
  };

  return (
    <div
      onClick={() => navigateTo('pdp', product.id)}
      className="group relative cursor-pointer flex flex-col justify-between w-full h-[360px] sm:h-[400px] md:h-[420px] bg-white border border-neutral-200/50 rounded-2xl overflow-hidden p-3 shadow-sm hover:shadow-xl transition-all duration-300"
      id={`product-card-${product.id}`}
    >
      {/* Upper Content Frame: Image + Badges */}
      <div>
        <div className="relative w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden bg-neutral-100">
          {/* Main Visual Image with Zoom Hover */}
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Quick float badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isTrending && (
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest font-semibold bg-neutral-900 text-white px-2 py-0.5 rounded uppercase">
                TRENDING
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest font-semibold bg-amber-600 text-white px-2 py-0.5 rounded uppercase">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest font-semibold bg-rose-600 text-white px-2 py-0.5 rounded uppercase">
                ONLY {product.stock} LEFT
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest font-semibold bg-neutral-400 text-white px-2 py-0.5 rounded uppercase">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Wishlist Trigger Heart */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-neutral-300/30 text-neutral-600 hover:text-rose-500 transition-all duration-300 shadow-sm"
            id={`wishlist-toggle-${product.id}`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={14} className={`transition-transform duration-300 active:scale-125 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Golden Rating star tag */}
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 text-[9px] sm:text-xs font-semibold bg-white/80 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-neutral-200/40 text-neutral-800 shadow-sm">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Content detail layout */}
        <div className="mt-3.5 space-y-1">
          {/* Brand identifier */}
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            {product.brand}
          </span>
          {/* Main Title */}
          <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>
      </div>

      {/* Lower content section: Pricing and shopping utilities */}
      <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          {/* Current calculated price */}
          <span className="text-sm sm:text-base font-bold text-neutral-900">
            ${product.price}
          </span>
          {/* Strikethrough pricing */}
          {product.discountPercent > 0 && (
            <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Quick Add buttons */}
        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          className={`p-2.5 rounded-xl border border-[#111827]/10 shadow-sm transition-all duration-200 ${
            product.stock === 0
              ? 'bg-[#111827]/5 text-neutral-300 cursor-not-allowed'
              : 'bg-[#f59e0b] hover:bg-amber-500 text-black hover:scale-105 active:scale-95 text-neutral-700'
          }`}
          id={`quick-add-btn-${product.id}`}
          title="Quick Add to Cart (Default Specs)"
        >
          <ShoppingCart size={14} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
