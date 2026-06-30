import jwt from 'jsonwebtoken';
import redis from '../lib/upstash.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await redis.get(`user:${decoded.username}`);
    
    if (!userData) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    req.user = { username: decoded.username, role: JSON.parse(userData).role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Admin only.' });
  }
  next();
};
