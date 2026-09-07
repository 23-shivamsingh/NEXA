import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNexaStore } from '../../store/useNexaStore';
import { X, Command, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'O', label: 'Orbit View', category: 'Navigation' },
  { key: 'S', label: 'Living Spaces', category: 'Navigation' },
  { key: 'M', label: 'Memory Garden', category: 'Navigation' },
  { key: 'Q', label: 'Social Quests', category: 'Navigation' },
  { key: 'P', label: 'People Signals', category: 'Navigation' },
  { key: 'I', label: 'Your Identity / Aura', category: 'Navigation' },
  { key: '/', label: 'Universal Search', category: 'Actions' },
  { key: 'C', label: 'AI Concierge', category: 'Actions' },
  { key: 'F', label: 'Tune Frequencies', category: 'Actions' },
  { key: 'D', label: 'Start Drift', category: 'Actions' },
  { key: 'Space', label: 'Pause / Resume Orbit Rotation', category: 'Orbit' },
  { key: 'Esc', label: 'Close Active Modal', category: 'Global' },
  { key: '?', label: 'Show Keyboard Shortcuts', category: 'Help' },
];

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsHelpOpen, toggleShortcutsHelp } = useNexaStore();

  if (!isShortcutsHelpOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="keyboard-shortcuts-overlay"
        onClick={() => toggleShortcutsHelp(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f24] p-6 shadow-2xl text-slate-900 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Keyboard className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 id="shortcuts-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Keyboard Shortcuts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pro spatial navigation across NEXA
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleShortcutsHelp(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Shortcuts Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
            {SHORTCUTS.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] px-3 py-2 text-xs"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {item.label}
                </span>
                <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          {/* Hint Footer */}
          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Press <kbd className="font-mono font-bold text-slate-700 dark:text-slate-300">?</kbd> anywhere to open</span>
            <span>Esc to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
