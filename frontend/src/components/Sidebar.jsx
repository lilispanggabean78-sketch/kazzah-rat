import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaTools, 
  FaDatabase, 
  FaGamepad,
  FaChartBar,
  FaUserSecret
} from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/tools', icon: <FaTools />, label: 'Tools' },
    { path: '/results', icon: <FaDatabase />, label: 'Results' },
    { path: '/gamezone', icon: <FaGamepad />, label: 'Game Zone' },
  ];

  return (
    <aside className="w-64 bg-secondary/80 backdrop-blur-md border-r border-accent/20 min-h-screen p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-accent/20 text-accent glow-border'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-dark/50 border border-accent/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaUserSecret />
            <span>Owner: KingJack</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">KazzahRAT V1</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
