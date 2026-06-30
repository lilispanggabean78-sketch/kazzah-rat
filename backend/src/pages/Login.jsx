import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTelegram, FaWhatsapp } from 'react-icons/fa';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal! Periksa username dan password.');
      document.querySelector('.login-box')?.classList.add('shake');
      setTimeout(() => {
        document.querySelector('.login-box')?.classList.remove('shake');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-box w-full max-w-md mx-4"
      >
        <div className="glass-effect rounded-2xl p-8 glow-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold glow-text">KazzahRAT</h1>
            <p className="text-gray-400 mt-2 typing-effect text-sm">Welcome Back</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark/50 border border-accent/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark/50 border border-accent/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition"
                placeholder="Masukkan password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-glow text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 glow-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : '➡️ SIGN IN'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-accent/10">
            <div className="flex justify-center gap-6 text-sm">
              <a
                href="https://t.me/KazzahOffc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition flex items-center gap-2"
              >
                <FaTelegram /> @KazzahOffc
              </a>
              <a
                href="https://wa.me/6281532210923"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition flex items-center gap-2"
              >
                <FaWhatsapp /> +62 815-3221-0923
              </a>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-600">Kazzah RAT V1</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
