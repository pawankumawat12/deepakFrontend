import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any fast-changing value (e.g. search query input).
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 600ms)
 */
export function useDebounce<T>(value: T, delay: number = 600): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

