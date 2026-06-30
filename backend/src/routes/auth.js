import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../lib/upstash.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const userData = await redis.get(`user:${username}`);
    if (!userData) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = JSON.parse(userData);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Register (hanya admin yang bisa)
router.post('/register', async (req, res) => {
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

    res.status(201).json({ message: 'User berhasil didaftarkan', user: { username, role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;
