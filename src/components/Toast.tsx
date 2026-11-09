import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-800/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40',
    info: 'bg-slate-800/95 border-blue-500/40 text-blue-100 shadow-blue-950/40',
    warning: 'bg-slate-800/95 border-amber-500/40 text-amber-100 shadow-amber-950/40',
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium leading-tight select-none">{toast.text}</p>
      </div>
    </div>
  );
};
