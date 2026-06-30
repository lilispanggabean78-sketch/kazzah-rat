import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaTrash, FaEdit, FaUserCog } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Gagal ambil data users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      toast.success('User berhasil ditambahkan!');
      setShowAddModal(false);
      setNewUser({ username: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal tambah user');
    }
  };

  const handleDeleteUser = async (username) => {
    if (!confirm(`Hapus user ${username}?`)) return;
    try {
      await api.delete(`/users/${username}`);
      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (err) {
      toast.error('Gagal hapus user');
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
    <ProtectedRoute adminOnly>
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
                <h2 className="text-2xl font-bold glow-text">Admin Panel</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-accent hover:bg-glow text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FaUserPlus /> Tambah User
                </button>
              </div>

              <div className="glass-effect rounded-xl p-6 glow-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-accent/20">
                        <th className="text-left py-3 text-gray-400 text-sm">Username</th>
                        <th className="text-left py-3 text-gray-400 text-sm">Role</th>
                        <th className="text-left py-3 text-gray-400 text-sm">Created</th>
                        <th className="text-right py-3 text-gray-400 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.username} className="border-b border-accent/10 hover:bg-white/5 transition">
                          <td className="py-3 text-white">{user.username}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-cyber/20 text-cyber'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="text-blue-400 hover:text-blue-300 transition">
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.username)}
                                className="text-red-400 hover:text-red-300 transition"
                                disabled={user.username === 'KazzahOffc'}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary rounded-xl p-6 max-w-md w-full glow-border"
          >
            <h3 className="text-xl font-bold mb-4">Tambah User Baru</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-dark/50 border border-accent/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-dark/50 border border-accent/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-dark/50 border border-accent/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-accent hover:bg-glow text-white py-2 rounded-lg transition">
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default AdminPanel;
