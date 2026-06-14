import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Public: list products
router.get('/', async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(products);
});

// Public: get a single product with reviews
router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { reviews: { orderBy: { date: 'desc' } } },
  });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Admin & Moderator: create product
router.post('/', requireAuth, requireRole('ADMIN', 'MODERATOR'), async (req, res) => {
  const body = req.body;
  const product = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice,
      discountPercent: body.discountPercent ?? 0,
      category: body.category,
      brand: body.brand,
      rating: body.rating ?? 0,
      reviewCount: body.reviewCount ?? 0,
      images: body.images ?? [],
      sizes: body.sizes ?? [],
      colors: body.colors ?? [],
      stock: body.stock ?? 0,
      isTrending: !!body.isTrending,
      isDealOfDay: !!body.isDealOfDay,
      recentlyViewed: !!body.recentlyViewed,
    },
  });
  res.status(201).json(product);
});

// Admin & Moderator: update product
router.put('/:id', requireAuth, requireRole('ADMIN', 'MODERATOR'), async (req, res) => {
  const body = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        discountPercent: body.discountPercent,
        category: body.category,
        brand: body.brand,
        images: body.images,
        sizes: body.sizes,
        colors: body.colors,
        stock: body.stock,
        isTrending: body.isTrending,
        isDealOfDay: body.isDealOfDay,
        recentlyViewed: body.recentlyViewed,
      },
    });
    res.json(product);
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Admin only: delete product
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

export default router;
