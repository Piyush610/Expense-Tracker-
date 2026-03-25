import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChartIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { MonthlyBarChart, CategoryPieChart } from '../components/ChartComponents';
import { SkeletonChart } from '../components/SkeletonLoader';
import CategoryIcon from '../components/CategoryIcon';
import api from '../services/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/api/transactions/summary');
        setData(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const topCategory = data?.byCategory?.[0];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Financial Analytics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Visualize your income and expenditure patterns over time.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart /> <SkeletonChart />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 flex items-center gap-5 group">
              <CategoryIcon 
                category={topCategory?._id} size={28} 
                className="w-14 h-14 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/10" 
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Top Category</p>
                <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  {topCategory?._id || 'None'}
                </h3>
                <p className="text-sm opacity-60 mt-0.5">₹{topCategory?.total.toLocaleString() || 0} spent total</p>
              </div>
            </div>

            <div className="card p-6 flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Savings Rate</p>
                <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  {data?.income > 0 ? ((data.balance / data.income) * 100).toFixed(1) : 0}%
                </h3>
                <p className="text-sm opacity-60 mt-0.5">Efficiency of your monthly budget</p>
              </div>
            </div>
          </div>

          {/* Detailed Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <MonthlyBarChart data={data?.monthly} />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <CategoryPieChart data={data?.byCategory} />
            </motion.div>
          </div>

          {/* Category List Details */}
          {data?.byCategory?.length > 0 && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Expenditure Breakdown</h3>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {data.byCategory.map((cat) => {
                  const totalExp = data.byCategory.reduce((acc, c) => acc + c.total, 0);
                  const percentage = ((cat.total / totalExp) * 100).toFixed(1);
                  
                  return (
                    <div key={cat._id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <CategoryIcon category={cat._id} size={16} />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{cat._id}</p>
                          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>₹{cat.total.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="card p-6 border-l-4 border-primary-500"
          >
            <div className="flex gap-4">
              <div className="text-primary-400"><Info size={20} /></div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>Spending Insights</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Your highest expenditure is in <strong>{topCategory?._id}</strong>. 
                  {data?.balance > 0 
                  ? " You are currently maintaining a positive balance. Keep up the good work on your savings habit!"
                  : " Your total expenses exceed your income. Consider reviewing your top categories to identify potential savings."}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
