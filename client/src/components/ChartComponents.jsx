import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PIE_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#f97316', '#ec4899', '#14b8a6', '#3b82f6',
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3 text-sm" style={{ minWidth: 140 }}>
        {label && <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>}
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function MonthlyBarChart({ data = [] }) {
  // Transform aggregate data from API into chart-friendly format
  const monthlyMap = {};
  data.forEach(({ _id, total }) => {
    const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: MONTHS[_id.month - 1], income: 0, expense: 0 };
    monthlyMap[key][_id.type] += total;
  });
  const chartData = Object.values(monthlyMap);

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Monthly Overview</h3>
      {chartData.length === 0 ? (
        <p className="text-center py-10 text-sm" style={{ color: 'var(--text-secondary)' }}>No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={6} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function CategoryPieChart({ data = [] }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Expenses by Category</h3>
      {data.length === 0 ? (
        <p className="text-center py-10 text-sm" style={{ color: 'var(--text-secondary)' }}>No expense data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data.map((d) => ({ name: d._id, value: d.total }))}
              cx="50%" cy="50%" innerRadius={60} outerRadius={90}
              paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={800}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
            <Legend
              formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
