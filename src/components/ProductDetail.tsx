import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, Heart, ShoppingCart, Send, CreditCard } from 'lucide-react';
import { Color } from '../types';

interface ReviewInput {
  name: string;
  rating: number;
  comment: string;
}

export const ProductDetail: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
  } = useApp();

  const product = products.find(p => p.id === selectedProductId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center select-none min-h-[60vh]">
        <h2 className="text-xl font-serif font-bold text-neutral-900">Catalogue Item Not Found</h2>
        <p className="text-sm text-neutral-500 font-light mt-1 max-w-sm">The selected item may have been removed from the directory by a store administrator.</p>
        <button onClick={() => navigateTo('home')} className="mt-6 bg-neutral-900 px-6 py-2.5 text-xs text-white rounded-full">Go Back Home</button>
      </div>
    );
  }

  // Swatches & quantities states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  // Review states representational
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Courtney Henry', rating: 5, date: 'June 01, 2026', comment: 'Absolutely mesmerizing finish. The gold shine is pristine and not loud at all. Keeps precise Swiss timing.' },
    { id: 2, author: 'Dianne Russell', rating: 4, date: 'May 24, 2026', comment: 'Exceptional craftsmanship. Matches heavily with both formal evening suits and casual linen tees.' }
  ]);
  const [newReview, setNewReview] = useState<ReviewInput>({ name: '', rating: 5, comment: '' });

  // Initialize first size/color on product swap
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setSelectedColor(product.colors[0] || null);
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [product]);

  const handlePrevImage = () => {
    setActiveImageIdx(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedColor) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    // Let's pop a silent confirmation via UI
  };

  const handleBuyNow = () => {
    if (!selectedColor) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const formattedReview = {
      id: Date.now(),
      author: newReview.name,
      rating: newReview.rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: newReview.comment
    };

    setReviews(prev => [formattedReview, ...prev]);
    setNewReview({ name: '', rating: 5, comment: '' });
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-32 font-sans" id="pdp-page">
      {/* Breadcrumb path navigation link */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 select-none font-medium">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-900 transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => { navigateTo('plp'); }} className="hover:text-neutral-900 transition-colors">Catalog</button>
        <span>/</span>
        <span className="text-neutral-600 truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: SWIPEABLE GALLERIES WITH THUMBNAILS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-neutral-100 group">
            {/* Main high resolution detail banner with css hover zoomer */}
            <div className="w-full h-full overflow-hidden">
              <img
                src={product.images[activeImageIdx]}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out hover:scale-[1.4] cursor-crosshair"
                id="main-pdp-gallery-image"
              />
            </div>

            {/* Left selector */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 backdrop-blur-md border border-neutral-200 text-neutral-800 shadow hover:bg-white active:scale-95 duration-200"
              title="Previous image"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Right selector */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 backdrop-blur-md border border-neutral-200 text-neutral-800 shadow hover:bg-white active:scale-95 duration-200"
              title="Next image"
            >
              <ChevronRight size={16} />
            </button>

            {/* Rating floating tag overlay */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 text-xs rounded-full inline-flex font-mono items-center gap-1.5 font-medium">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{product.rating} / 5.0</span>
            </div>
          </div>

          {/* Galleries thumbnail slides bar */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {product.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 bg-neutral-50 ${activeImageIdx === idx ? 'border-amber-600 shadow-md scale-95' : 'border-neutral-200/50 hover:border-neutral-350 opacity-85 hover:opacity-100'}`}
              >
                <img src={imgUrl} alt="Thumbnail preview" className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CORE SUMMARY, CHOOSERS AND TABS */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Brand + Title + Quick Indicators */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  {product.brand}
                </span>
                
                {/* Active stock metrics tracker */}
                {product.stock > 0 ? (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-rose-600 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Rating count indicator summary */}
              <div className="flex items-center gap-3.5 pt-1 text-xs text-neutral-500">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.floor(product.rating) ? 'fill-current text-amber-500' : 'text-neutral-200'}
                    />
                  ))}
                </div>
                <span>{reviews.length} Verified Buyer Reviews</span>
              </div>
            </div>

            {/* Price section layout */}
            <div className="py-4 border-y border-neutral-150 flex items-center justify-between select-none">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Pricing Standard</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">${product.price}</span>
                  {product.discountPercent > 0 && (
                    <>
                      <span className="text-sm line-through text-neutral-400 font-mono">${product.originalPrice}</span>
                      <span className="text-xs font-semibold text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded-md font-mono">
                        {product.discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Wishlist Heart overlay button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full border shadow-sm transition-all duration-300 ${isWishlisted ? 'bg-rose-500 text-white border-rose-500 scale-102 shadow' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 active:scale-95'}`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* SWATCHES CHOOSE MODULE */}
            <div className="space-y-5 select-none">
              
              {/* Color Circles selection */}
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-neutral-900">
                      Colour: <span className="text-neutral-500 font-normal">{selectedColor?.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((colorSpec) => {
                      const isActive = selectedColor?.name === colorSpec.name;
                      return (
                        <button
                          key={colorSpec.name}
                          onClick={() => setSelectedColor(colorSpec)}
                          style={{ backgroundColor: colorSpec.hex }}
                          className={`relative w-8 h-8 rounded-full border shadow-sm transition-all active:scale-90 ${isActive ? 'ring-2 ring-offset-2 ring-amber-500 scale-105 border-transparent' : 'border-neutral-200/40 hover:scale-102'}`}
                          title={colorSpec.name}
                        >
                          {isActive && (
                            <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full border border-black/30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Select swatch pills */}
              {product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-neutral-900">
                      Size Selection: <span className="text-neutral-500 font-normal">{selectedSize}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sz) => {
                      const isActive = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`text-xs px-4 py-2 border rounded-xl font-semibold transition-all active:scale-95 ${isActive ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-300/80 hover:border-neutral-450 hover:bg-neutral-50'}`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantities input selector */}
              <div className="space-y-2 w-28">
                <span className="text-xs font-semibold tracking-wide text-neutral-900">Quantity</span>
                <div className="flex items-center border border-neutral-300 rounded-xl px-1.5 h-10 bg-white">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => prev - 1)}
                    className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 duration-150 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono text-sm font-semibold text-neutral-800">{quantity}</span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 duration-150 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIONS BUTTONS DESKTOP - hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-950 hover:text-white font-semibold py-3.5 px-6 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm active:scale-95 duration-200 disabled:opacity-30"
                id="pdp-add-to-cart-btn"
              >
                <ShoppingCart size={15} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 px-6 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow shadow-amber-600/25 active:scale-95 duration-200 disabled:opacity-30"
                id="pdp-buy-now-btn"
              >
                Buy Now
              </button>
            </div>

            {/* STICKY BOTTOM ACTION BAR FOR MOBILE ONLY */}
            <div className="md:hidden fixed bottom-16 sm:bottom-20 left-0 right-0 z-40 bg-zinc-900 border-t border-neutral-800 p-3.5 flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-100 text-xs py-3 rounded-full font-bold uppercase active:scale-95 disabled:opacity-30 text-center"
              >
                Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-3 rounded-full font-bold uppercase active:scale-95 disabled:opacity-30 text-center"
              >
                Buy Now
              </button>
            </div>

            {/* ACCORDION INFORMATION TABS */}
            <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-sm" id="pdp-accordion-tabs">
              <div className="flex border-b border-neutral-200 text-xs font-semibold tracking-wider uppercase text-neutral-500 bg-neutral-50/50">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-3 text-center border-b-2 hover:text-neutral-900 outline-none transition-all ${activeTab === 'details' ? 'border-neutral-950 text-neutral-950 font-bold bg-white' : 'border-transparent'}`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`flex-1 py-3 text-center border-b-2 hover:text-neutral-900 outline-none transition-all ${activeTab === 'care' ? 'border-neutral-950 text-neutral-950 font-bold bg-white' : 'border-transparent'}`}
                >
                  Material Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`flex-1 py-3 text-center border-b-2 hover:text-neutral-900 outline-none transition-all ${activeTab === 'shipping' ? 'border-neutral-950 text-neutral-950 font-bold bg-white' : 'border-transparent'}`}
                >
                  Shipping & Return
                </button>
              </div>

              <div className="p-4 text-xs sm:text-sm text-neutral-600 leading-relaxed min-h-[100px] bg-white">
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-500">
                      <li>Model Reference: Model ID: {product.id}</li>
                      <li>Standard sizing options: {product.sizes.join(', ')}</li>
                      <li>Collection origin: Italian/Spanish inspired curation</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'care' && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-neutral-855">Maintenance Checklist:</p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-500">
                      <li>Store in matching protective micro-pouch when idle.</li>
                      <li>Avoid spraying water, body parfums, or harsh cosmetics explicitly onto active surfaces.</li>
                      <li>Clean using dry high-filament microfiber lint wipes. No coarse solvents.</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>Standard express dispatch within 24 hours of checkout completion.</p>
                    <div className="flex flex-col gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Truck size={13} className="text-amber-600" />
                        <span>Complimentary courier dispatch above $150.</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700">
                        <RefreshCw size={13} className="text-amber-600" />
                        <span>Frictionless 30-day replacement policy on unworn items.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* REVIEWS COMPONENT SECTOR */}
      <section className="mt-16 border-t border-neutral-200/50 pt-10 select-none">
        <h3 className="text-base sm:text-lg font-serif font-bold text-neutral-950 mb-6 flex items-center gap-2">
          Customer Verification & Feedback ({reviews.length})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Reviews list */}
          <div className="lg:col-span-7 space-y-5">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-150 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-neutral-600 border border-neutral-200 shadow-sm uppercase">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 block">{rev.author}</span>
                      <span className="text-[10px] text-neutral-400 block">{rev.date}</span>
                    </div>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={i < rev.rating ? 'fill-current' : 'text-neutral-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed">"{rev.comment}"</p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded w-max">
                  <ShieldCheck size={11} />
                  Verified Aura Buyer
                </div>
              </div>
            ))}
          </div>

          {/* New Review Add Form */}
          <form onSubmit={handleAddReview} className="lg:col-span-12 xl:col-span-5 bg-neutral-50/50 border border-neutral-200/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-neutral-900">Post Buyer Feedback</h4>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-600 block">Your Display Name</label>
              <input
                type="text"
                required
                value={newReview.name}
                onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Joe Harrison"
                className="w-full bg-white text-xs border border-neutral-200 outline-none focus:border-amber-500 p-3 rounded-xl shadow-sm text-neutral-800"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-600 block">Item Rating Assessment</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating: s }))}
                    className="p-1 px-2 border rounded-lg bg-white hover:bg-neutral-105 transition-colors active:scale-95 duration-100 flex items-center gap-1 text-xs font-mono font-bold"
                  >
                    <Star size={11} className={s <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'} />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-600 block">Review Comment</label>
              <textarea
                required
                rows={3}
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Describe your authentic experience with the fabric texture, materials, hardware fit..."
                className="w-full bg-white text-xs border border-neutral-200 outline-none focus:border-amber-500 p-3 rounded-xl shadow-sm text-neutral-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase py-3 rounded-xl duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Send size={12} />
              Submit Review
            </button>
          </form>

        </div>
      </section>

    </div>
  );
};
