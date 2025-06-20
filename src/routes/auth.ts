import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const normalizedUserId = userId.toLowerCase();
    const adminUsers = process.env.ADMIN_USERS?.split(',') || [];
    const isValidUser = adminUsers.map(u => u.toLowerCase()).includes(normalizedUserId);
    const isValidPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);

    if (!isValidUser || !isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: normalizedUserId, role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
