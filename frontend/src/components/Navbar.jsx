import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCog, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-secondary/80 backdrop-blur-md border-b border-accent/20 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold glow-text">KazzahRAT</h1>
          <span className="text-xs text-cyber">v1.0</span>
          {user?.role === 'admin' && (
            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">ADMIN</span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition">
            <FaBell size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{user?.username}</span>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-accent hover:text-white transition"
              >
                <FaUserCog size={18} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
