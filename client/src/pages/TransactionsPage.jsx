import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit2, Trash2, Calendar, FileDown, Plus } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useDebounce } from '../hooks/useDebounce';
import { SkeletonRow } from '../components/SkeletonLoader';
import TransactionModal from '../components/TransactionModal';
import ExportButton from '../components/ExportButton';
import CategoryIcon from '../components/CategoryIcon';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All Categories', 'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
  'Housing', 'Healthcare', 'Education', 'Travel', 'Utilities',
  'Salary', 'Freelance', 'Investment', 'Other',
];

export default function TransactionsPage() {
  const { transactions, loading, total, pages, fetchTransactions, deleteTransaction, updateTransaction, createTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useState({ type: 'all', category: 'All Categories', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const refreshTransactions = useCallback((p = page) => {
    fetchTransactions({ 
      ...filters, 
      category: filters.category === 'All Categories' ? 'all' : filters.category,
      search: debouncedSearch, 
      page: p, 
      limit: 8 
    });
  }, [filters, debouncedSearch, page, fetchTransactions]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(id);
        toast.success('Deleted successfully');
        
        // If it was the last item on the page (and not page 1), go back one page
        const isLastOnPage = transactions.length === 1 && page > 1;
        const targetPage = isLastOnPage ? page - 1 : page;
        if (isLastOnPage) setPage(targetPage);
        
        refreshTransactions(targetPage);
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const handleEdit = (tx) => {
    setEditingId(tx);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Transactions</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Total: {total} transactions found</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton />
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2 py-2.5 px-5">
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-xs font-semibold mb-1.5 block opacity-60">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input 
              type="text" placeholder="Search title..." className="input-field pl-10 h-10"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block opacity-60">Type</label>
          <select 
            className="input-field h-10" 
            value={filters.type} 
            onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block opacity-60">Category</label>
          <select 
            className="input-field h-10" 
            value={filters.category} 
            onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs font-semibold mb-1.5 block opacity-60">Date Range</label>
            <div className="flex items-center gap-2">
              <input type="date" className="input-field h-10 p-1" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
              <input type="date" className="input-field h-10 p-1" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
              <tr className="text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Title / Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan="4"><SkeletonRow /></td></tr>)
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                    No transactions matched your criteria.
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {transactions.map((tx) => (
                    <motion.tr 
                      key={tx._id} layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CategoryIcon category={tx.category} size={16} className="flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{tx.title}</p>
                            <p className="text-xs mt-0.5 opacity-60 font-medium">{tx.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm opacity-80 font-medium">
                        {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(tx)} className="p-2 btn-ghost text-blue-400 rounded-lg"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(tx._id)} className="p-2 btn-ghost text-red-400 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="p-4 flex items-center justify-center gap-2 border-t" style={{ borderColor: 'var(--border)' }}>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingId(null); }} 
        editData={editingId}
        onSubmit={async (payload) => {
          try {
            if (editingId) {
              await updateTransaction(editingId._id, payload);
              toast.success('Updated successfully');
            } else {
              await createTransaction(payload);
              toast.success('Added successfully');
              setPage(1); // Return to first page to see new entry
            }
            refreshTransactions(editingId ? page : 1);
            setIsModalOpen(false);
          } catch (err) {
            toast.error(editingId ? 'Failed to update' : 'Failed to add');
          }
        }}
      />
    </div>
  );
}
