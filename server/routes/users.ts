import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const safeUser = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  isActive: true,
  joinedDate: true,
} as const;

// Authenticated: get own profile
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: safeUser,
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Admin only: list all users
router.get('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const users = await prisma.user.findMany({ select: safeUser, orderBy: { joinedDate: 'desc' } });
  res.json(users);
});

// Admin only: create a new member directly
router.post('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const { email, fullName, role, isActive, password } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: 'email and fullName are required' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password || 'password123', 10);
  const user = await prisma.user.create({
    data: { email, fullName, password: hashed, role: role ?? 'CUSTOMER', isActive: isActive ?? true },
    select: safeUser,
  });
  res.status(201).json(user);
});

// Admin only: update a user's details / role / active status
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const { email, fullName, role, isActive } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { email, fullName, role, isActive },
      select: safeUser,
    });
    res.json(user);
  } catch {
    res.status(404).json({ error: 'User not found' });
  }
});

// Admin only: remove a member
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
