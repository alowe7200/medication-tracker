import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const next = typeof value === 'function' ? value(storedValue) : value;
      setStoredValue(next);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.error('useLocalStorage write error:', err);
    }
  };

  return [storedValue, setValue];
}
