import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'paper', label: 'Paper', swatch: ['#F3F4EF', '#2E4DE8', '#B8862A'] },
  { id: 'midnight', label: 'Midnight', swatch: ['#0B0E17', '#6C8CFF', '#C084FC'] },
  { id: 'aurora', label: 'Aurora', swatch: ['#0E1416', '#2DD4BF', '#A78BFA'] },
  { id: 'sunbeam', label: 'Sunbeam', swatch: ['#FBF4EC', '#E0592A', '#D6336C'] },
];

const STORAGE_KEY = 'campusiq-theme';

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some((t) => t.id === stored)) return stored;
  } catch {
    /* localStorage unavailable — fall through to default */
  }
  return 'paper';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    if (theme === 'paper') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* best effort persistence */
    }
  }, [theme]);

  const setTheme = useCallback((id) => {
    if (THEMES.some((t) => t.id === id)) setThemeState(id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
