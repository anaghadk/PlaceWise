import { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeSwitcher.css';

export default function ThemeSwitcher({ align = 'start', placement = 'up' }) {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const active = themes.find((t) => t.id === theme);

  return (
    <div className={`theme-switcher align-${align} placement-${placement}`} ref={ref}>
      <button
        type="button"
        className="theme-switcher-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Switch theme"
      >
        <Palette size={15} strokeWidth={1.8} />
        <span>{active?.label ?? 'Theme'}</span>
      </button>

      {open && (
        <div className="theme-switcher-menu fade-up" role="menu">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={t.id === theme}
              className={'theme-option' + (t.id === theme ? ' active' : '')}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
            >
              <span className="theme-option-swatch">
                {t.swatch.map((c, i) => (
                  <i key={i} style={{ background: c }} />
                ))}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
