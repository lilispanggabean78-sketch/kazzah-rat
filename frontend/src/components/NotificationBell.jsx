import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../api/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/victims/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Gagal ambil notifikasi:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-gray-400 hover:text-white transition"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-secondary border border-accent/20 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-accent/10">
            <h3 className="text-sm font-semibold">Notifikasi</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="px-3 py-2 hover:bg-white/5 border-b border-accent/5">
                  <div className="text-sm text-white">{n.message}</div>
                  <div className="text-xs text-gray-500">{new Date(n.time).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
