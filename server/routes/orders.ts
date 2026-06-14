import { Router } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Generate a unique order ID in the ORD-XXXXX format used by the seed data
async function generateOrderId(): Promise<string> {
  while (true) {
    const candidate = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const existing = await prisma.order.findUnique({ where: { id: candidate } });
    if (!existing) return candidate;
  }
}

// Admin & Moderator: list all orders
router.get('/', requireAuth, requireRole('ADMIN', 'MODERATOR'), async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { date: 'desc' },
  });
  res.json(orders);
});

// Authenticated: list current user's orders
router.get('/my', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: { items: { include: { product: true } } },
    orderBy: { date: 'desc' },
  });
  res.json(orders);
});

// Authenticated: get single order (owner, admin or moderator)
router.get('/:id', requireAuth, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } } },
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user!.userId && !['ADMIN', 'MODERATOR'].includes(req.user!.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(order);
});

// Authenticated: place a new order
router.post('/', requireAuth, async (req, res) => {
  const body = req.body;
  const items = body.items as Array<{
    productId: string;
    quantity: number;
    selectedSize: string;
    selectedColorName: string;
    selectedColorHex: string;
  }>;

  if (!items?.length) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const priceMap = new Map(products.map((p) => [p.id, p.price]));

  const subtotal = items.reduce((sum, item) => sum + (priceMap.get(item.productId) ?? 0) * item.quantity, 0);
  const discount = body.discount ?? 0;
  const tax = body.tax ?? Number(((subtotal - discount) * 0.08).toFixed(2));
  const deliveryFee = body.deliveryFee ?? 0;
  const total = Number((subtotal - discount + tax + deliveryFee).toFixed(2));

  const order = await prisma.order.create({
    data: {
      id: await generateOrderId(),
      userId: req.user!.userId,
      subtotal,
      discount,
      tax,
      deliveryFee,
      total,
      paymentMethod: body.paymentMethod ?? 'Cash on Delivery',
      paymentStatus: 'Pending',
      customerEmail: req.user!.email,
      fullName: body.address.fullName,
      phone: body.address.phone,
      addressLine: body.address.addressLine,
      city: body.address.city,
      state: body.address.state,
      zipCode: body.address.zipCode,
      country: body.address.country,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColorName: item.selectedColorName,
          selectedColorHex: item.selectedColorHex,
          priceAtPurchase: priceMap.get(item.productId) ?? 0,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Decrement stock for each ordered product
  await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      }).catch(() => {})
    )
  );

  res.status(201).json(order);
});

// Admin & Moderator: update order status / payment status
router.patch('/:id', requireAuth, requireRole('ADMIN', 'MODERATOR'), async (req, res) => {
  const { status, paymentStatus } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        paymentStatus: paymentStatus ?? (status === 'Delivered' ? 'Paid' : undefined),
      },
    });
    res.json(order);
  } catch {
    res.status(404).json({ error: 'Order not found' });
  }
});

export default router;
