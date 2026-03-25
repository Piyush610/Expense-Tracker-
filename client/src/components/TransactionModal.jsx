import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
  'Housing', 'Healthcare', 'Education', 'Travel', 'Utilities',
  'Salary', 'Freelance', 'Investment', 'Other',
];

const DEFAULT_FORM = {
  title: '', amount: '', type: 'expense', category: 'Food & Dining',
  date: new Date().toISOString().split('T')[0], note: '',
};

export default function TransactionModal({ isOpen, onClose, onSubmit, editData = null }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || '',
        amount: editData.amount || '',
        type: editData.type || 'expense',
        category: editData.category || 'Food & Dining',
        date: editData.date ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        note: editData.note || '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setError('');
  }, [editData, isOpen]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      setError('Please fill in all required fields'); return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay fixed inset-0 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="card w-full max-w-md"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {editData ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <button onClick={onClose} className="btn-ghost p-1.5">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Type toggle */}
                <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  {['expense', 'income'].map((t) => (
                    <button
                      key={t} type="button"
                      className="flex-1 py-2.5 text-sm font-semibold transition-all capitalize"
                      style={{
                        background: form.type === t
                          ? t === 'income' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'
                          : 'transparent',
                        color: form.type === t
                          ? t === 'income' ? '#22c55e' : '#ef4444'
                          : 'var(--text-secondary)',
                      }}
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Grocery shopping" className="input-field" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Amount (₹) *</label>
                    <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date *</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} className="input-field" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Note (optional)</label>
                  <input name="note" value={form.note} onChange={handleChange} placeholder="Any extra details..." className="input-field" />
                </div>

                <button type="submit" className="btn-primary w-full py-3 mt-1" disabled={loading}>
                  {loading ? 'Saving...' : editData ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
