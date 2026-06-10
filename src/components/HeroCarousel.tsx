import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  themeColor: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400',
    badge: 'SUMMER COMMENCEMENT',
    title: 'Elysian High Summer Collection',
    subtitle: 'Woven mulberry silks, fine linens, and lightweight tortoiseshell acetate accessories.',
    category: 'Women',
    themeColor: 'from-rose-950/40 via-neutral-900/40 to-neutral-50/10'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1400',
    badge: 'LUXURY TIMEPIECES',
    title: 'Precision In Gold & Ceramic',
    subtitle: 'Limited-edition Swiss quartz watches designed for minimalist visual clarity.',
    category: 'Accessories',
    themeColor: 'from-amber-950/45 via-neutral-900/40 to-neutral-50/10'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1400',
    badge: 'FLORENTINE CRAFTSMANSHIP',
    title: 'Saffiano Leather Goods',
    subtitle: 'Exquisite hand-stitched travel bags and briefcases to refine your spatial travel.',
    category: 'Women',
    themeColor: 'from-neutral-950/50 via-neutral-950/40 to-neutral-50/10'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { navigateTo, updateFilters } = useApp();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000); // Auto-slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleShopNow = (category: string) => {
    updateFilters({ category });
    navigateTo('plp');
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden shadow-sm group select-none">
      {/* Slides mapping */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Dark Glass / Tint Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.themeColor} mix-blend-multiply z-10`}></div>
          
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />

          {/* Foreground Text Content */}
          <div className="absolute inset-x-0 bottom-0 top-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-3xl text-white">
            <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-xs font-mono tracking-widest text-amber-400 font-semibold uppercase mb-2 sm:mb-3">
              <Sparkles size={12} className="animate-pulse" />
              {slide.badge}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-tight leading-tight mb-2 sm:mb-4 text-white drop-shadow-sm">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-neutral-200 font-sans tracking-wide mb-5 sm:mb-8 font-light leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleShopNow(slide.category)}
                className="bg-white hover:bg-neutral-100 text-neutral-900 border border-transparent shadow shadow-neutral-900/10 hover:shadow-md hover:scale-[1.02] text-xs sm:text-sm font-semibold tracking-wider uppercase px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full transition-all duration-300"
                id={`hero-shop-now-btn-${slide.id}`}
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Left/Right navigation handles */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 Transition-all duration-300 pointer-events-auto"
        id="hero-carousel-prev"
        title="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
        id="hero-carousel-next"
        title="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide Indicators Dots bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 bg-white' : 'bg-white/40'}`}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
