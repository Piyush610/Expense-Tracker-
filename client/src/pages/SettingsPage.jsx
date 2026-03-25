import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Palette, Shield, Info, Edit3, X, Save, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemePanel from '../components/ThemePanel';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const start2FASetup = async () => {
    if (user?.twoFactorEnabled) {
      if (window.confirm("Disable 2FA?")) {
        const res = await updateProfile({ twoFactorEnabled: false });
        if (res.success) toast.success("2FA Disabled");
      }
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/api/auth/2fa/setup');
      setTwoFactorData(data);
      setIsSettingUp2FA(true);
    } catch (err) {
      toast.error("Failed to start 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/2fa/verify', { token: twoFactorToken });
      toast.success("2FA Enabled Successfully!");
      setIsSettingUp2FA(false);
      updateProfile({ twoFactorEnabled: true }); // Sync local state
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your workspace preferences and security.</p>
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6">
        
        {/* Profile Card */}
        <motion.div variants={itemVars} className="card p-8 flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all duration-700" />
          
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary-500/30">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          
          <div className="flex-1 relative z-10">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
            <p className="text-sm font-medium opacity-60 mb-4">{user?.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 size={12} /> Verified Member
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                SaaS Tier: Professional
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-ghost flex items-center gap-2 py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold border border-white/5"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </motion.div>

        {/* Customization */}
        <motion.div variants={itemVars} className="card overflow-hidden">
          <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <Palette size={20} className="text-primary-400" />
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Vibe Customization</h3>
            </div>
          </div>
          <div className="p-8 bg-black/5">
            <ThemePanel />
          </div>
        </motion.div>

        {/* Security & System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVars} className="card p-8 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-8">
              <Shield size={22} className="text-emerald-400" />
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Security Center</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Authenticator App (2FA)</p>
                  <p className="text-[10px] opacity-40">{user?.twoFactorEnabled ? 'Highly Secure' : 'Add an extra layer of security'}</p>
                </div>
                <button 
                  onClick={start2FASetup}
                  className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center p-1 ${user?.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <motion.div 
                    animate={{ x: user?.twoFactorEnabled ? 24 : 0 }}
                    className="w-4 h-4 rounded-full bg-white shadow-lg" 
                  />
                </button>
              </div>
              <button className="btn-ghost w-full py-4 text-sm font-bold bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10">
                Change Master Password
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="card p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <Info size={22} className="text-blue-400" />
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>System Insights</h3>
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm opacity-50 font-medium">App Version</span>
                <span className="text-sm font-black tracking-widest leading-none bg-blue-500/10 text-blue-400 px-2 py-1 rounded">V2.4.0</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm opacity-50 font-medium">Server Latency</span>
                <span className="text-sm font-bold text-emerald-400 animate-pulse">12ms</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm opacity-50 font-medium">Uptime Guarantee</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>99.99%</span>
              </div>
            </div>
          </motion.div>
        </div>

      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none"
            >
              <form 
                onSubmit={handleUpdate}
                className="card w-full max-w-lg p-0 pointer-events-auto overflow-hidden shadow-2xl shadow-black"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="p-8 border-b flex justify-between items-center bg-black/10" style={{ borderColor: 'var(--border)' }}>
                   <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>Update Profile</h2>
                      <p className="text-xs opacity-40 uppercase font-black tracking-widest mt-1">SaaS Interface v2.0</p>
                   </div>
                   <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost p-2 opacity-40 hover:opacity-100 transition-opacity"><X size={24} /></button>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 opacity-50">Display Name</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors opacity-40"><User size={20} /></span>
                      <input 
                        required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="input-field pl-12 h-14 bg-black/20 border-white/5 focus:border-primary-500/40 rounded-2xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 opacity-50">Email Address</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors opacity-40"><Mail size={20} /></span>
                      <input 
                        required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input-field pl-12 h-14 bg-black/20 border-white/5 focus:border-primary-500/40 rounded-2xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 opacity-50">Change Password (optional)</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors opacity-40"><Lock size={20} /></span>
                      <input 
                        type="password" placeholder="Leave blank to keep current" 
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="input-field pl-12 h-14 bg-black/20 border-white/5 focus:border-primary-500/40 rounded-2xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-black/20 flex gap-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost flex-1 py-4 font-black">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl font-black">
                    {loading ? 'Processing...' : <><Save size={20} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Setup 2FA Modal */}
      <AnimatePresence>
        {isSettingUp2FA && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]"
              onClick={() => setIsSettingUp2FA(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[130] flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="card w-full max-w-md p-0 pointer-events-auto overflow-hidden bg-slate-900 border-white/10 shadow-2xl shadow-black">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                  <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Setup 2FA</h3>
                  <button onClick={() => setIsSettingUp2FA(false)} className="btn-ghost p-1.5"><X size={20} /></button>
                </div>
                
                <div className="p-8 text-center space-y-8">
                  <p className="text-sm opacity-60 px-4">Scan this QR code with your Authenticator app (Google Authenticator, Authy, etc.)</p>
                  
                  <div className="bg-white p-4 rounded-[2.5rem] inline-block shadow-2xl shadow-primary-500/20 mx-auto border-[12px] border-white/5 transition-transform hover:scale-105 duration-500">
                    <img src={twoFactorData?.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>

                  <div className="py-5 px-6 bg-black/40 rounded-3xl border border-white/5 mx-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Manual Backup Secret</p>
                    <code className="text-xs font-black tracking-widest text-primary-400 select-all break-all leading-relaxed block px-2">
                      {twoFactorData?.secret}
                    </code>
                  </div>

                  <form onSubmit={verifyAndEnable2FA} className="space-y-6">
                    <div className="text-center">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-40">Confirm Verification Code</label>
                      <input 
                        required type="text" maxLength="6" placeholder="000 000"
                        className="input-field h-16 bg-black/40 border-white/10 rounded-2xl text-center text-3xl font-black tracking-[0.4em] focus:border-primary-500 transition-all shadow-inner"
                        value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-5 rounded-2xl font-black tracking-[0.2em] uppercase text-xs shadow-xl shadow-primary-500/30">
                      {loading ? 'Authenticating Security...' : 'Activate 2FA Secure'}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
