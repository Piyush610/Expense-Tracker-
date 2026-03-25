import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { prefs } = useTheme();

  return (
    <div className={`app-bg density-${prefs.density} flex`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-5 py-4 sticky top-0 z-20"
          style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost p-2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>ExpenseIQ</h2>
        </header>

        {/* Page content */}
        <motion.main
          key="main"
          className="flex-1 p-5 lg:p-8 flex flex-col"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex-1">
            <Outlet />
          </div>
          
          <footer className="mt-8 pt-4 border-t border-white/5 text-center w-full pb-2">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40" style={{ color: 'var(--text-secondary)' }}>
              &copy; {new Date().getFullYear()} Piyush Kumar. All Rights Reserved.
            </p>
          </footer>
        </motion.main>
      </div>
    </div>
  );
}
