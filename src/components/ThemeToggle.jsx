'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-bg-secondary text-text-light hover:text-text transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <div className="flex items-center gap-2">
          <FiMoon className="w-5 h-5" />
          <span>Dark</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FiSun className="w-5 h-5" />
          <span>Light</span>
        </div>
      )}
    </button>
  );
}
