import React from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { Sparkles, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNexaStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none md:bottom-8 md:right-8">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-xs shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'aura'
              ? 'border-purple-500/50 bg-[#120a24]/95 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : toast.type === 'success'
              ? 'border-emerald-500/50 bg-[#061c14]/95 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'border-cyan-500/40 bg-[#061324]/95 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          }`}
        >
          {toast.type === 'aura' ? (
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
