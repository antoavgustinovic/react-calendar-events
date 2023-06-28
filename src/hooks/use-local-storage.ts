import React, { useCallback, useEffect, useState } from 'react';

interface Props<T> {
  key: string;
  initialValue?: T;
}

type ReturnType<T> = [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, () => void];

function useLocalStorage<T>({ key, initialValue }: Props<T>): ReturnType<T> {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : initialValue;
    } catch (F) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (storedValue) {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        /* empty */
      }
    }
  }, [storedValue, key]);

  const removeKey = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch (error) {
      /* empty */
    }
  }, [key, setStoredValue]);

  return [storedValue, setStoredValue, removeKey];
}

useLocalStorage.propTypes = {};

export default useLocalStorage;
