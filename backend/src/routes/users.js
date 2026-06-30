import express from 'express';
import bcrypt from 'bcryptjs';
import redis from '../lib/upstash.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const usernames = await redis.smembers('users');
    const users = [];
    for (const username of usernames) {
      const data = await redis.get(`user:${username}`);
      if (data) {
        const user = JSON.parse(data);
        users.push({ username: user.username, role: user.role, createdAt: user.createdAt });
      }
    }
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Create user (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const existing = await redis.get(`user:${username}`);
    if (existing) {
      return res.status(400).json({ message: 'Username sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { username, password: hashedPassword, role, createdAt: new Date().toISOString() };

    await redis.set(`user:${username}`, JSON.stringify(userData));
    await redis.sadd('users', username);

    res.status(201).json({ message: 'User berhasil ditambahkan', user: { username, role } });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Delete user (admin only)
router.delete('/:username', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    if (username === 'KazzahOffc') {
      return res.status(400).json({ message: 'Tidak bisa menghapus owner' });
    }

    const existing = await redis.get(`user:${username}`);
    if (!existing) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    await redis.del(`user:${username}`);
    await redis.srem('users', username);

    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;
