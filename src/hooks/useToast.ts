import { useState, useCallback } from 'react';
import uuidv4 from '../util/uuidv4';

export type ToastState = 'visible' | 'hiding' | 'hidden';

export interface Toast {
  id: string;
  message: string;
  timeout: number;
  state: ToastState;
}

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, timeout: number = 3000) => {

    const id = uuidv4();
    const newToast: Toast = { id, message, timeout, state: 'visible' };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) => toast.id === id ? { ...toast, state: 'hiding' } : toast)
      )
    }, timeout);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, timeout + 500); // 500ms for hiding animation
  }, [toasts]);

  return { toasts, addToast };
};

export default useToast;