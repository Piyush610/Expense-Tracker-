import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const icons = {
  balance: Wallet,
  income: TrendingUp,
  expense: TrendingDown,
};

const colors = {
  balance: { icon: '#6366f1', glow: 'rgba(99,102,241,0.2)', from: '#6366f1', to: '#8b5cf6' },
  income:  { icon: '#22c55e', glow: 'rgba(34,197,94,0.2)',  from: '#22c55e', to: '#10b981' },
  expense: { icon: '#ef4444', glow: 'rgba(239,68,68,0.2)',  from: '#ef4444', to: '#f97316' },
};

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val || 0);
}

export default function StatCard({ type = 'balance', value = 0, subtitle = '', trend = null }) {
  const Icon = icons[type];
  const color = colors[type];

  const renderTrend = () => {
    if (!trend || trend.last === 0) return null;
    const diff = trend.current - trend.last;
    const percent = ((Math.abs(diff) / trend.last) * 100).toFixed(1);
    const isUp = diff > 0;
    
    // Good/Bad logic
    let isGood = isUp;
    if (type === 'expense') isGood = !isUp;
    if (type === 'balance') isGood = isUp;

    return (
      <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {percent}%
      </div>
    );
  };

  return (
    <motion.div
      className="card p-5 flex flex-col gap-4 relative overflow-hidden cursor-default"
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ background: `radial-gradient(circle, ${color.from}, transparent)`, transform: 'translate(30%, -30%)' }}
      />

      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color.glow }}
        >
          <Icon size={22} style={{ color: color.icon }} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
            style={{ background: color.glow, color: color.icon }}
          >
            {type}
          </span>
          {renderTrend()}
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(value)}
        </p>
        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
          {subtitle || (type === 'balance' ? 'Net Balance' : type === 'income' ? 'Total Income' : 'Total Expenses')}
        </p>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to}, transparent)` }}
      />
    </motion.div>
  );
}
