import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Authenticated customer: add a review to a product
router.post('/product/:productId', requireAuth, async (req, res) => {
  const { rating, comment } = req.body;
  if (rating == null || !comment) {
    return res.status(400).json({ error: 'rating and comment are required' });
  }

  const product = await prisma.product.findUnique({ where: { id: req.params.productId } });
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const review = await prisma.review.create({
    data: {
      productId: product.id,
      userId: user.id,
      author: user.fullName,
      rating,
      comment,
    },
  });

  const reviews = await prisma.review.findMany({ where: { productId: product.id } });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await prisma.product.update({
    where: { id: product.id },
    data: { reviewCount: reviews.length, rating: Number(avgRating.toFixed(1)) },
  });

  res.status(201).json(review);
});

// Admin & Moderator: delete (moderate) a review
router.delete('/:id', requireAuth, requireRole('ADMIN', 'MODERATOR'), async (req, res) => {
  try {
    const review = await prisma.review.delete({ where: { id: req.params.id } });

    const reviews = await prisma.review.findMany({ where: { productId: review.productId } });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await prisma.product.update({
      where: { id: review.productId },
      data: { reviewCount: reviews.length, rating: Number(avgRating.toFixed(1)) },
    });

    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Review not found' });
  }
});

export default router;
