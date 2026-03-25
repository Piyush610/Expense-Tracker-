import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemePanel() {
  const { prefs, setTheme, setAccent, setDensity, THEMES, ACCENT_COLORS } = useTheme();

  const themeEmojis = { dark: '🌙', light: '☀️', blue: '🌊', purple: '💜', green: '🌿', neon: '⚡' };

  return (
    <div className="flex flex-col gap-6">
      {/* Theme */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>THEME</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <motion.button
              key={t} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(t)}
              className="py-3 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold capitalize transition-all border-2"
              style={{
                background: prefs.theme === t ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
                borderColor: prefs.theme === t ? 'var(--accent)' : 'var(--border)',
                color: prefs.theme === t ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              <span className="text-xl">{themeEmojis[t]}</span>
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>ACCENT COLOR</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ACCENT_COLORS).map(([key, hex]) => (
            <motion.button
              key={key} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={() => setAccent(key)}
              className="w-9 h-9 rounded-full transition-all border-2"
              style={{
                background: hex,
                borderColor: prefs.accentKey === key ? 'var(--text-primary)' : 'transparent',
                boxShadow: prefs.accentKey === key ? `0 0 0 3px ${hex}44` : 'none',
              }}
              title={key}
            />
          ))}
        </div>
      </div>

      {/* Density */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>UI DENSITY</h3>
        <div className="flex gap-3">
          {['compact', 'comfortable'].map((d) => (
            <button
              key={d} onClick={() => setDensity(d)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold capitalize border-2 transition-all"
              style={{
                background: prefs.density === d ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
                borderColor: prefs.density === d ? 'var(--accent)' : 'var(--border)',
                color: prefs.density === d ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {d === 'compact' ? '⊟ Compact' : '⊞ Comfortable'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
