import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RefreshCcw, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import CategoryIcon from './CategoryIcon';

const CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
  'Housing', 'Healthcare', 'Education', 'Travel', 'Utilities',
  'Other',
];

export default function BudgetModal({ isOpen, onClose, onSave }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCurrentBudgets = async () => {
        try {
          const { data } = await api.get('/api/budgets');
          setBudgets(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCurrentBudgets();
    }
  }, [isOpen]);

  const handleUpdate = async (category, amount) => {
    if (amount === undefined || amount === '') return;
    try {
      await api.post('/api/budgets', { category, amount: Number(amount) });
      toast.success(`${category} budget updated`);
      onSave?.();
    } catch (err) {
      toast.error('Failed to update budget');
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all budgets for this month?")) return;
    setLoading(true);
    try {
      // In a real app, you might have a bulk delete API. 
      // For now, we'll just loop through and delete them.
      for (const b of budgets) {
        await api.delete(`/api/budgets/${b._id}`);
      }
      toast.success('All budgets reset');
      setBudgets([]);
      onSave?.();
      onClose();
    } catch (err) {
      toast.error('Failed to reset budgets');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id, cat) => {
    try {
      await api.delete(`/api/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
      toast.success(`${cat} budget cleared`);
      onSave?.();
    } catch (err) {
      toast.error('Failed to delete budget');
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay fixed inset-0 z-[60]" onClick={onClose}
          />
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="card w-full max-w-lg pointer-events-auto max-h-[85vh] flex flex-col overflow-hidden shadow-2xl shadow-black/50" 
                 style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(32px)', border: '1px solid var(--border)' }}>
              
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div>
                  <h2 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Manage Budgets</h2>
                  <p className="text-xs opacity-40 mt-0.5">Set monthly spending limits</p>
                </div>
                <button onClick={onClose} className="btn-ghost p-1.5"><X size={20} /></button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                {CATEGORIES.map((cat) => {
                  const existing = budgets.find(b => b.category === cat);
                  return (
                    <div key={cat} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 group hover:bg-white/[0.08] transition-colors border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-3">
                        <CategoryIcon category={cat} size={14} className="opacity-60" />
                        <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-30">₹</span>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            className="bg-black/20 border-none rounded-xl h-10 pl-7 pr-3 w-28 text-sm font-bold text-right focus:ring-1 focus:ring-primary-500 transition-all"
                            style={{ color: 'var(--text-primary)' }}
                            defaultValue={existing?.amount || ''}
                            onBlur={(e) => handleUpdate(cat, e.target.value)}
                          />
                        </div>
                        {existing && (
                          <button 
                            onClick={() => deleteCategory(existing._id, cat)}
                            className="p-2 hover:text-red-400 opacity-20 hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 border-t bg-black/20 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <button 
                  onClick={handleReset} 
                  disabled={loading || budgets.length === 0}
                  className="btn-ghost flex items-center gap-2 text-sm text-red-500/60 hover:text-red-400 hover:bg-red-500/5 font-bold"
                >
                  <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                  Reset All
                </button>
                <button onClick={onClose} className="btn-primary py-2.5 px-10 rounded-xl">Save & Close</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
