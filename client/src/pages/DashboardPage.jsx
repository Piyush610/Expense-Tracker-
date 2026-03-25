import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List } from 'lucide-react';
import StatCard from '../components/StatCard';
import { MonthlyBarChart, CategoryPieChart } from '../components/ChartComponents';
import { SkeletonCard, SkeletonChart } from '../components/SkeletonLoader';
import TransactionModal from '../components/TransactionModal';
import CategoryIcon from '../components/CategoryIcon';
import BudgetSection from '../components/BudgetSection';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [quickLogData, setQuickLogData] = useState(null);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/api/transactions/summary');
      setData(data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleAddSuccess = () => {
    fetchSummary();
    toast.success('Transaction added!');
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Good Day! 💸</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Welcome back to your financial control center.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-6 shadow-xl shadow-primary-500/20"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVars} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {loading ? (
          <>
            <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
          </>
        ) : (
          <>
            <motion.div variants={itemVars}><StatCard type="balance" value={data?.balance} trend={data?.trends ? { current: data.trends.income.current - data.trends.expense.current, last: data.trends.income.last - data.trends.expense.last } : null} /></motion.div>
            <motion.div variants={itemVars}><StatCard type="income" value={data?.income} trend={data?.trends?.income} /></motion.div>
            <motion.div variants={itemVars}><StatCard type="expense" value={data?.expense} trend={data?.trends?.expense} /></motion.div>
          </>
        )}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {loading ? (
          <>
            <SkeletonChart /> <SkeletonChart />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <MonthlyBarChart data={data?.monthly} />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <CategoryPieChart data={data?.byCategory} />
            </motion.div>
          </>
        )}
      </div>

      {/* Quick Actions & Recent Transactions */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budgets & Progress */}
          <div className="lg:col-span-2">
            <BudgetSection />
          </div>

          {/* Quick Add */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Quick Log</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Coffee', cat: 'Food & Dining', amt: 50 },
                { label: 'Lunch', cat: 'Food & Dining', amt: 250 },
                { label: 'Taxi', cat: 'Transportation', amt: 150 },
                { label: 'Grocery', cat: 'Shopping', amt: 1200 },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setQuickLogData({ 
                      title: chip.label, 
                      amount: chip.amt, 
                      category: chip.cat, 
                      type: 'expense',
                      date: new Date().toISOString().split('T')[0]
                    });
                    setModalOpen(true);
                  }}
                  className="card px-4 py-3 flex items-center gap-3 active:scale-95 text-sm font-medium"
                >
                  <CategoryIcon category={chip.cat} size={14} />
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <TransactionModal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setQuickLogData(null); }} 
        editData={quickLogData}
        onSubmit={async (payload) => {
          await api.post('/api/transactions', payload);
          handleAddSuccess();
          setModalOpen(false);
          setQuickLogData(null);
        }} 
      />
    </div>
  );
}
