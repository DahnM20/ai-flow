// useLocalStorage.ts
import { useState, useEffect } from "react";

/**
 * A custom hook that synchronizes state with localStorage.
 *
 * @param key - The key under which the value is stored in localStorage.
 * @param initialValue - The initial value to use if the key does not exist in localStorage.
 * @returns A stateful value and a function to update it.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state with a function to avoid reading localStorage on every render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      // If window is undefined, likely during SSR, return initialValue
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect to update localStorage whenever storedValue changes
  useEffect(() => {
    if (typeof window === "undefined") {
      // If window is undefined, do nothing
      return;
    }
    try {
      const valueToStore =
        storedValue instanceof Function
          ? storedValue(storedValue)
          : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
