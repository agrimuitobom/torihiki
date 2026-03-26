import { useState, useCallback, useRef } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 1800);
  }, []);

  return { toast, showToast };
};
