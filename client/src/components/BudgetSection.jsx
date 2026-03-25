import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Settings2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import CategoryIcon from './CategoryIcon';
import BudgetModal from './BudgetModal';

export default function BudgetSection() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBudgets = async () => {
    try {
      const { data } = await api.get('/api/budgets');
      setBudgets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Target size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Monthly Budgets</h3>
            <p className="text-xs opacity-60">Track your spending by category</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(true)} 
          className="btn-ghost p-2 rounded-lg"
          title="Manage Budgets"
        >
          <Settings2 size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {budgets.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed rounded-2xl flex flex-col items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm opacity-60">No budgets set for this month</p>
            <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-orange-400 hover:text-orange-300">Set your first limit</button>
          </div>
        ) : (
          budgets.map((b) => {
            const percent = Math.min((b.spent / b.amount) * 100 || 0, 100);
            const isNearLimit = percent > 80;
            const isOverLimit = b.amount > 0 && b.spent >= b.amount;

            return (
              <div key={b._id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={b.category} size={14} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{b.category}</span>
                  </div>
                  <span className="text-xs font-bold opacity-60">
                    ₹{b.spent.toLocaleString()} / <span style={{ color: 'var(--text-primary)' }}>₹{b.amount.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}
                  />
                </div>
                {isOverLimit && (
                  <p className="text-[10px] text-red-500 mt-1 font-bold uppercase tracking-wider">Over Budget!</p>
                )}
              </div>
            );
          })
        )}
      </div>

      <BudgetModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        onSave={fetchBudgets}
      />
    </div>
  );
}
