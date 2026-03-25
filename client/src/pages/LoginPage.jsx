import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  
  const { login, login2FA, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.pending2FA) {
      toast.success('Identity verified. Enter 2FA code.');
      setIs2FA(true);
    } else if (res.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(res.message);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const res = await login2FA(email, otpToken);
    if (res.success) {
      toast.success('Login Successful');
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
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-10 relative z-10 overflow-hidden shadow-2xl shadow-black/40 border-white/5"
      >
        <AnimatePresence mode="wait">
          {!is2FA ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Wallet size={36} className="text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase italic" style={{ color: 'var(--text-primary)' }}>ExpenseIQ</h1>
                <p className="text-xs font-black uppercase tracking-[0.3em] mt-2 opacity-30">Financial Command Center</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 opacity-50">Master Email</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-primary-400 transition-all"><Mail size={18} /></span>
                    <input 
                      type="email" required placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-12 h-14 bg-black/20 border-white/5 focus:border-primary-500/40 rounded-2xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 opacity-50">Vault Password</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-primary-400 transition-all"><Lock size={18} /></span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-12 pr-14 h-14 bg-black/20 border-white/5 focus:border-primary-500/40 rounded-2xl font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full h-14 flex items-center justify-center gap-3 group rounded-2xl font-bold tracking-widest uppercase text-xs">
                  {loading ? 'Decrypting Vault...' : 'Access Account'}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <p className="mt-10 text-center text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                New Commander? <Link to="/register" className="text-primary-400 hover:text-primary-300 ml-1">Forge Credentials</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="2fa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setIs2FA(false)}
                className="btn-ghost p-2 -ml-2 mb-6 opacity-40 hover:opacity-100 flex items-center gap-2 text-xs font-bold"
              >
                <ChevronLeft size={16} /> Back to Login
              </button>

              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                  <ShieldCheck size={36} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: 'var(--text-primary)' }}>Identify Secure</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-30">ENTER 2FA AUTHENTICATOR CODE</p>
              </div>

              <form onSubmit={handle2FASubmit} className="space-y-6 text-center">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center opacity-40">Verification Key</label>
                  <input 
                    required type="text" maxLength="6" placeholder="000 000"
                    className="input-field h-20 bg-black/30 border-white/10 rounded-3xl text-center text-4xl font-black tracking-[0.4em] focus:border-emerald-500 focus:ring-emerald-500/20 shadow-inner"
                    style={{ color: 'var(--text-primary)' }}
                    value={otpToken} onChange={(e) => setOtpToken(e.target.value)}
                    autoFocus
                  />
                  <p className="text-[10px] text-center mt-6 font-bold opacity-30 leading-relaxed uppercase tracking-wider">
                    Check your Google Authenticator or <br /> Authy application for the code.
                  </p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full h-16 bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-3 rounded-2xl font-black tracking-[0.2em] uppercase text-xs shadow-xl shadow-emerald-500/20 mt-4">
                  {loading ? 'Securing Link...' : 'Confirm Identity'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
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
