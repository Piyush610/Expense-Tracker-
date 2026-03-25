import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Mail, Lock, User, Plus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      toast.success('Welcome aboard!');
      navigate('/');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/20 mb-4">
            <Wallet size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>Join ExpenseIQ</h1>
          <p className="text-sm mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>Master your finances today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}><User size={18} /></span>
              <input 
                type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}><Mail size={18} /></span>
              <input 
                type="email" required placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}><Lock size={18} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 group mt-2">
            {loading ? 'Creating Account...' : 'Get Started'}
            {!loading && <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>Sign In</Link>
        </p>
      </motion.div>

      {/* Copyright Notice */}
      <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none z-10">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase opacity-30" style={{ color: 'var(--text-primary)' }}>
          &copy; {new Date().getFullYear()} Piyush Kumar. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
