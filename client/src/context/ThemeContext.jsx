import { createContext, useContext, useState, useEffect } from 'react';

const THEMES = ['dark', 'light', 'blue', 'purple', 'green', 'neon'];
const ACCENT_COLORS = {
  indigo: '#6366f1',
  violet: '#8b5cf6',
  blue: '#3b82f6',
  cyan: '#06b6d4',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
};

const ThemeContext = createContext(null);

const defaultPrefs = {
  theme: 'dark',
  accentKey: 'indigo',
  density: 'comfortable',
};

export function ThemeProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('vibePrefs');
      return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const accent = ACCENT_COLORS[prefs.accentKey] || ACCENT_COLORS.indigo;

  useEffect(() => {
    localStorage.setItem('vibePrefs', JSON.stringify(prefs));

    // Apply theme class to html element
    const root = document.documentElement;
    THEMES.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${prefs.theme}`);

    // Apply accent CSS variable
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-hover', shadeColor(accent, -15));
  }, [prefs, accent]);

  const setTheme = (theme) => setPrefs((p) => ({ ...p, theme }));
  const setAccent = (accentKey) => setPrefs((p) => ({ ...p, accentKey }));
  const setDensity = (density) => setPrefs((p) => ({ ...p, density }));

  return (
    <ThemeContext.Provider value={{ prefs, setTheme, setAccent, setDensity, THEMES, ACCENT_COLORS, accent }}>
      {children}
    </ThemeContext.Provider>
  );
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return '#' + ((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1);
}

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
