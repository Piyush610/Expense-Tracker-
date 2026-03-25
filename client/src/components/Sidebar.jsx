import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  LogOut,
  Wallet,
  X,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const themeGradients = {
  dark: 'from-indigo-500 to-purple-600',
  light: 'from-indigo-400 to-purple-500',
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-emerald-500 to-teal-600',
  neon: 'from-cyan-400 to-teal-500',
};

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const { prefs } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const gradient = themeGradients[prefs.theme] || themeGradients.dark;

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>ExpenseIQ</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Finance Tracker</p>
          </div>
        </div>
        {/* Close on mobile */}
        <button onClick={onClose} className="lg:hidden btn-ghost p-1.5">
          <X size={16} />
        </button>
      </div>

      {/* User Badge */}
      <NavLink 
        to="/settings" 
        onClick={onClose}
        className="card p-3 mb-6 mx-1 flex items-center gap-3 hover:bg-white/[0.08] transition-all group border-transparent hover:border-white/10"
      >
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
          <p className="text-xs truncate opacity-40 group-hover:opacity-60 transition-opacity">View Settings</p>
        </div>
      </NavLink>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="nav-link w-full text-left mt-4 hover:text-red-400"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden lg:flex flex-col w-64 min-h-screen fixed top-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay fixed inset-0 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="sidebar fixed top-0 left-0 h-full w-64 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
