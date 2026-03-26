import { useState, useCallback, useRef } from 'react';

interface ToastState {
  message: string;
  visible: boolean;
}

export const useToast = (): { toast: ToastState; showToast: (message: string) => void } => {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 1800);
  }, []);

  return { toast, showToast };
};
