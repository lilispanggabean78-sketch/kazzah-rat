import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaDesktop, FaClock, FaNewspaper } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVictims: 0,
    onlineUsers: 0,
    activeTools: 0,
  });
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, newsRes] = await Promise.all([
          api.get('/victims/stats'),
          api.get('/victims/news'),
        ]);
        setStats(statsRes.data);
        setLatestNews(newsRes.data);
      } catch (err) {
        console.error('Gagal ambil data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { icon: <FaUsers />, label: 'Total Victims', value: stats.totalVictims, color: 'text-accent' },
    { icon: <FaDesktop />, label: 'Online Users', value: stats.onlineUsers, color: 'text-cyber' },
    { icon: <FaClock />, label: 'Active Tools', value: stats.activeTools, color: 'text-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-accent text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 glow-text">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-xl p-6 glow-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{card.label}</p>
                      <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                    <div className={`text-2xl ${card.color}`}>{card.icon}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-effect rounded-xl p-6 glow-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaNewspaper /> Latest News
                </h3>
                {latestNews.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada berita terbaru</p>
                ) : (
                  <div className="space-y-3">
                    {latestNews.map((news, i) => (
                      <div key={i} className="border-b border-accent/10 pb-3">
                        <p className="text-sm text-white">{news.title}</p>
                        <p className="text-xs text-gray-500">{new Date(news.date).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-effect rounded-xl p-6 glow-border">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-accent/20 hover:bg-accent/30 text-accent py-2 rounded-lg transition">
                    Deploy Tools
                  </button>
                  <button className="bg-cyber/20 hover:bg-cyber/30 text-cyber py-2 rounded-lg transition">
                    Generate Link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
