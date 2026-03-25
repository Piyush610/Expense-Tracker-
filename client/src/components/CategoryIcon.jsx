import { 
  Utensils, ShoppingBag, Car, Film, Home, HeartPulse, 
  GraduationCap, Plane, Zap, Banknote, Briefcase, TrendingUp, HelpCircle 
} from 'lucide-react';

const CATEGORY_MAP = {
  'Food & Dining': { icon: Utensils, color: '#f87171' },
  'Shopping': { icon: ShoppingBag, color: '#fb923c' },
  'Transportation': { icon: Car, color: '#fbbf24' },
  'Entertainment': { icon: Film, color: '#a78bfa' },
  'Housing': { icon: Home, color: '#60a5fa' },
  'Healthcare': { icon: HeartPulse, color: '#f472b6' },
  'Education': { icon: GraduationCap, color: '#fb7185' },
  'Travel': { icon: Plane, color: '#2dd4bf' },
  'Utilities': { icon: Zap, color: '#818cf8' },
  'Salary': { icon: Banknote, color: '#34d399' },
  'Freelance': { icon: Briefcase, color: '#4ade80' },
  'Investment': { icon: TrendingUp, color: '#22d3ee' },
  'Other': { icon: HelpCircle, color: '#94a3b8' },
};

export default function CategoryIcon({ category, size = 18, className = "" }) {
  const { icon: Icon, color } = CATEGORY_MAP[category] || CATEGORY_MAP['Other'];
  
  return (
    <div 
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${className}`}
      style={{ background: `${color}15`, color: color }}
    >
      <Icon size={size} />
    </div>
  );
}
