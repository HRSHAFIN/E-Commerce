import { Product, User, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Aura Minimalist Gold Chronograph',
    description: 'Elevate your daily presence with our signature minimalist chronograph. Crafted from premium 316L stainless steel, wrapped in 18k champagne gold plating, and driven by a precise Swiss quartz movement. The pure white sandblasted dial features simple indices and a date window, protected by scratch-resistant sapphire crystal.',
    price: 349,
    originalPrice: 499,
    discountPercent: 30,
    category: 'Accessories',
    brand: 'Aura',
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800'
    ],
    sizes: ['38mm', '42mm'],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Elysian Silver', hex: '#C0C0C0' },
      { name: 'Midnight Black', hex: '#1C1C1C' }
    ],
    stock: 18,
    isTrending: true,
    isDealOfDay: true
  },
  {
    id: 'prod-2',
    title: 'Cognac Saffiano Leather Tote',
    description: 'A masterpiece of form and utility. Hand-stitched by skilled Florentine artisans, this structured tote is made from durable Saffiano calfskin, boasting an elegant cross-hatch texture. Features gold-toned Italian hardware, a padded notebook sleeve, and an integrated keychain lanyard.',
    price: 189,
    originalPrice: 280,
    discountPercent: 32,
    category: 'Women',
    brand: 'Cavallo',
    rating: 4.9,
    reviewCount: 96,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800'
    ],
    sizes: ['Standard'],
    colors: [
      { name: 'Cognac Brown', hex: '#8B4513' },
      { name: 'Noir Black', hex: '#111111' },
      { name: 'Desert Taupe', hex: '#B38B6D' }
    ],
    stock: 12,
    isTrending: true
  },
  {
    id: 'prod-3',
    title: 'Verdun Acetate Aviator Sunglasses',
    description: 'Crafted with thin warm-tortoise Japanese acetate rims and lightweight beta-titanium temples. Fitted with polarized CR-39 amber lenses that deliver 100% UVA/UVB protection and a custom anti-reflective back-coating. Designed to sit effortlessly on any face shape.',
    price: 119,
    originalPrice: 175,
    discountPercent: 32,
    category: 'Men',
    brand: 'Verdun',
    rating: 4.6,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800'
    ],
    sizes: ['Regular', 'Wide'],
    colors: [
      { name: 'Tortoise/Amber', hex: '#4A3B32' },
      { name: 'Glossy Black/Dark Gray', hex: '#000000' }
    ],
    stock: 25,
    recentlyViewed: true,
    isTrending: true
  },
  {
    id: 'prod-4',
    title: 'Ascot Genuine Wool Fedora',
    description: 'Made from 100% premium felted Australian merino wool, this classic fedora is water-resistant and offers UPF 50+ sun protection. Outfitted with an elegant genuine leather band, an internal adjustable Velcro strap for tailor-made fitting, and a moisture-wicking satin brow-band.',
    price: 79,
    originalPrice: 110,
    discountPercent: 28,
    category: 'Lifestyle',
    brand: 'Ascot & Co',
    rating: 4.5,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=800',
      'https://images.unsplash.com/photo-1534215754734-18e55d13ce32?q=80&w=800'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Charcoal Gray', hex: '#464646' },
      { name: 'Sand Brown', hex: '#C2B280' },
      { name: 'Olive Drab', hex: '#3B3C36' }
    ],
    stock: 7,
    isDealOfDay: true
  },
  {
    id: 'prod-5',
    title: 'Elysian Sterling Silver Cable Chain',
    description: 'A masterclass in contemporary jewelry. Handcrafted in heavy solid 925 sterling silver with a thick anti-tarnish rhodium shielding coat. Featuring custom diamond-cut links that catch the light elegantly from any angle, securely snapped with an engraved lobster-claw clasp.',
    price: 139,
    originalPrice: 199,
    discountPercent: 30,
    category: 'Accessories',
    brand: 'Aura',
    rating: 4.7,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800'
    ],
    sizes: ['18"', '20"', '22"'],
    colors: [
      { name: 'Silver Sterling', hex: '#E6E6FA' },
      { name: '18K Yellow Gold Filled', hex: '#FFD700' }
    ],
    stock: 14,
    recentlyViewed: true
  },
  {
    id: 'prod-6',
    title: 'Sartorial Silk Bandana Scarf',
    description: 'Woven from 14-momme pure Mulberry silk, printed with eco-friendly organic vegetable dyes in a gorgeous bohemian paisley pattern. Luxuriously soft, thermoregulating, and finished with clean hand-rolled edges.',
    price: 49,
    originalPrice: 75,
    discountPercent: 34,
    category: 'Lifestyle',
    brand: 'Sartorial',
    rating: 4.7,
    reviewCount: 33,
    images: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=800',
      'https://images.unsplash.com/photo-1588358249826-b8733f3801cf?q=80&w=800'
    ],
    sizes: ['Standard'],
    colors: [
      { name: 'Elysian Crimson', hex: '#9C2542' },
      { name: 'Sapphire Navy', hex: '#1E3E62' }
    ],
    stock: 22,
    isTrending: false
  },
  {
    id: 'prod-7',
    title: 'Heritage Heavyweight Denim Jacket',
    description: 'A timeless staple built to last a lifetime. Structured from 14.5oz sturdy Japanese selvedge denim cotton that breaks in beautifully over time to form a personalized fit. Outfitted with heavy reinforced copper shanks, deep internal waist utility slots, and adjustable waist cinches.',
    price: 159,
    originalPrice: 220,
    discountPercent: 27,
    category: 'Men',
    brand: 'Ascot & Co',
    rating: 4.8,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo Selvedge', hex: '#1A3050' },
      { name: 'Bleach Stonewash', hex: '#6D9BC3' }
    ],
    stock: 5,
    recentlyViewed: true
  },
  {
    id: 'prod-8',
    title: 'Chelsea Napa Leather Ankle Boots',
    description: 'These sleek Chelsea boots combine a luxurious formal look with maximum ergonomic comfort. Made from exceptionally soft tumbled Napa calfskin leather and featuring a lightweight, flexible Italian crepe rubber outsole. Handcrafted in Spain.',
    price: 219,
    originalPrice: 299,
    discountPercent: 26,
    category: 'Women',
    brand: 'Cavallo',
    rating: 4.9,
    reviewCount: 57,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800'
    ],
    sizes: ['6', '7', '8', '9'],
    colors: [
      { name: 'Deep Umber Brown', hex: '#4B3621' },
      { name: 'Onyx Black', hex: '#0B0B0B' }
    ],
    stock: 8,
    isDealOfDay: true
  },
  {
    id: 'prod-9',
    title: 'Kids Comfort Knitted Sweater',
    description: 'Ultra-soft, cozy organic cotton knit sweater for style-conscious kids. Completely scratch-free and highly breathable, perfect for cool evenings. Features an elegant woven knit structure that handles high-intensity play days and frequent washing with ease.',
    price: 39,
    originalPrice: 55,
    discountPercent: 29,
    category: 'Kids',
    brand: 'Junior Aura',
    rating: 4.7,
    reviewCount: 39,
    images: [
      'https://images.unsplash.com/photo-1611106211090-8f3c79eb8552?q=80&w=800',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800'
    ],
    sizes: ['2Y-3Y', '4Y-5Y', '6Y-7Y'],
    colors: [
      { name: 'Crayon Mustard', hex: '#E1AD01' },
      { name: 'Sage Green', hex: '#87A96B' }
    ],
    stock: 14,
    isTrending: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    email: 'hasiburshafin@gmail.com',
    fullName: 'Hasibur Shafin',
    role: 'admin',
    isActive: true,
    joinedDate: '2026-01-15'
  },
  {
    id: 'user-2',
    email: 'user@example.com',
    fullName: 'Jane Doe',
    role: 'customer',
    isActive: true,
    joinedDate: '2026-03-02'
  },
  {
    id: 'user-3',
    email: 'alex.h@lifestyle.com',
    fullName: 'Alex Hudson',
    role: 'customer',
    isActive: true,
    joinedDate: '2026-04-10'
  },
  {
    id: 'user-4',
    email: 'maria.s@gmail.com',
    fullName: 'Maria Santos',
    role: 'customer',
    isActive: false,
    joinedDate: '2026-05-18'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98421',
    date: '2026-06-08T14:32:00Z',
    items: [
      {
        id: 'prod-1-Midnight Black-42mm',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: '42mm',
        selectedColor: { name: 'Midnight Black', hex: '#1C1C1C' }
      }
    ],
    subtotal: 349,
    discount: 50,
    tax: 23.92,
    deliveryFee: 0,
    total: 322.92,
    address: {
      fullName: 'Jane Doe',
      phone: '+1 (555) 349-2918',
      addressLine: '782 Primrose Lane, Apt 4C',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      country: 'United States'
    },
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    customerEmail: 'user@example.com'
  },
  {
    id: 'ORD-72412',
    date: '2026-06-09T09:15:00Z',
    items: [
      {
        id: 'prod-3-Tortoise/Amber-Regular',
        product: INITIAL_PRODUCTS[2],
        quantity: 2,
        selectedSize: 'Regular',
        selectedColor: { name: 'Tortoise/Amber', hex: '#4A3B32' }
      },
      {
        id: 'prod-4-Charcoal Gray-M',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: { name: 'Charcoal Gray', hex: '#464646' }
      }
    ],
    subtotal: 317,
    discount: 25,
    tax: 23.36,
    deliveryFee: 15,
    total: 330.36,
    address: {
      fullName: 'Alex Hudson',
      phone: '+1 (555) 912-1452',
      addressLine: '12 Ocean Drive, Suite 100',
      city: 'Miami',
      state: 'Florida',
      zipCode: '33139',
      country: 'United States'
    },
    status: 'Shipped',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    customerEmail: 'alex.h@lifestyle.com'
  },
  {
    id: 'ORD-41258',
    date: '2026-06-10T18:45:00Z',
    items: [
      {
        id: 'prod-2-Cognac Brown-Standard',
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedSize: 'Standard',
        selectedColor: { name: 'Cognac Brown', hex: '#8B4513' }
      }
    ],
    subtotal: 189,
    discount: 10,
    tax: 14.32,
    deliveryFee: 0,
    total: 193.32,
    address: {
      fullName: 'Hasibur Shafin',
      phone: '+880 1712-345678',
      addressLine: 'House 42, Road 11, Banani',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1213',
      country: 'Bangladesh'
    },
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    customerEmail: 'hasiburshafin@gmail.com'
  }
];

export const BRANDS = ['Aura', 'Cavallo', 'Verdun', 'Ascot & Co', 'Sartorial', 'Junior Aura'];
export const CATEGORIES = ['Men', 'Women', 'Kids', 'Accessories', 'Lifestyle'];
export const SIZES = ['S', 'M', 'L', 'XL', 'Standard', '38mm', '42mm', 'Regular', 'Wide', '6', '7', '8', '9', '2Y-3Y', '4Y-5Y', '6Y-7Y'];
export const COLORS = [
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Elysian Silver', hex: '#C0C0C0' },
  { name: 'Midnight Black', hex: '#1C1C1C' },
  { name: 'Cognac Brown', hex: '#8B4513' },
  { name: 'Noir Black', hex: '#111111' },
  { name: 'Desert Taupe', hex: '#B38B6D' },
  { name: 'Tortoise/Amber', hex: '#4A3B32' },
  { name: 'Glossy Black/Dark Gray', hex: '#000000' },
  { name: 'Charcoal Gray', hex: '#464646' },
  { name: 'Sand Brown', hex: '#C2B280' },
  { name: 'Olive Drab', hex: '#3B3C36' },
  { name: 'Silver Sterling', hex: '#E6E6FA' },
  { name: '18K Yellow Gold Filled', hex: '#FFD700' },
  { name: 'Elysian Crimson', hex: '#9C2542' },
  { name: 'Sapphire Navy', hex: '#1E3E62' },
  { name: 'Indigo Selvedge', hex: '#1A3050' },
  { name: 'Bleach Stonewash', hex: '#6D9BC3' },
  { name: 'Deep Umber Brown', hex: '#4B3621' },
  { name: 'Onyx Black', hex: '#0B0B0B' },
  { name: 'Crayon Mustard', hex: '#E1AD01' },
  { name: 'Sage Green', hex: '#87A96B' }
];
