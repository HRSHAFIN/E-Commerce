import React from 'react';
import { useApp } from '../context/AppContext';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=150'
  },
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=150'
  },
  {
    id: 'kids',
    name: 'Kids',
    image: 'https://images.unsplash.com/photo-1611106211090-8f3c79eb8552?q=80&w=150'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=150'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=150'
  }
];

export const QuickCategories: React.FC = () => {
  const { navigateTo, updateFilters } = useApp();

  const handleCategoryClick = (categoryName: string) => {
    updateFilters({ category: categoryName });
    navigateTo('plp');
  };

  return (
    <div className="w-full py-2 bg-transparent select-none">
      <div className="flex items-center justify-between px-2 mb-4">
        <h2 className="text-xs sm:text-sm font-mono tracking-widest text-neutral-400 uppercase font-semibold">
          Browse Collections
        </h2>
      </div>
      
      {/* Circular Grid */}
      <div className="grid grid-cols-5 gap-3 sm:gap-6 justify-center">
        {CATEGORY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCategoryClick(item.name)}
            className="flex flex-col items-center cursor-pointer group"
          >
            {/* Circular Preview Container with Gold Glow on Hover */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-neutral-200/50 p-0.5 bg-white shadow-sm flex-shrink-0 duration-300 group-hover:border-amber-400 group-hover:shadow-lg group-hover:scale-105 active:scale-95">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
            {/* Category Descriptor Text label */}
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-neutral-600 mt-2 sm:mt-3 duration-200 group-hover:text-neutral-900 group-hover:font-bold text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
