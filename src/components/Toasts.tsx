import { useEffect, useState } from "react";
import { Toast as IToast, ToastState } from "../hooks/useToast";
import classNames from "../util/classNames";

const Toasts = ({ toasts }: { toasts: IToast[] }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} state={toast.state} />
      ))}
    </div>
  );
};

interface ToastProps {
  message: string;
  state: ToastState;
}

const Toast = ({ message, state }: ToastProps) => {
  const [className, setClassName] = useState('block');

  useEffect(() => {
    if (state === 'hidden') {
      setClassName('hidden');
    }
    if (state === 'hiding') {
      setClassName('opacity-0 translate-y-36');
    }
  }, [state]);

  return (
    <div className={classNames('bg-white shadow-md p-4 rounded-md transition', className)}>
      {message}
    </div>
  );
}

export default Toasts;
