import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const getStoredValue = (key, defaultValue) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    }
    return defaultValue;
  };

  const [theme, setTheme] = useState(() => getStoredValue('theme', 'Dark'));

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));

    if(theme === 'Dark'){
      document.body.classList.add('dark');
    }else{
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}