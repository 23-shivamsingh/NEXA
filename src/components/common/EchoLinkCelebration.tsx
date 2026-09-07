import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNexaStore } from '../../store/useNexaStore';
import { Ghost, Sparkles, Link2 } from 'lucide-react';

export const EchoLinkCelebration: React.FC = () => {
  const { celebratingEchoLink, setCelebratingEchoLink, currentUser, isGhostMode } = useNexaStore();

  useEffect(() => {
    if (!celebratingEchoLink) return;
    const timer = setTimeout(() => {
      setCelebratingEchoLink(null);
    }, 1500);
    return () => clearTimeout(timer);
  }, [celebratingEchoLink, setCelebratingEchoLink]);

  if (!celebratingEchoLink) return null;

  return (
    <AnimatePresence>
      <div
        id="echo-link-celebration-overlay"
        onClick={() => setCelebratingEchoLink(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md cursor-pointer select-none"
        role="status"
        aria-live="polite"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center max-w-sm w-full rounded-3xl border border-cyan-500/30 bg-[#080d1e]/95 p-8 text-center shadow-2xl shadow-cyan-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient harmonic background glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

          {/* Interactive node convergence arena */}
          <div className="relative flex items-center justify-center h-28 w-full">
            {/* Center connecting harmonic beam */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
              className="absolute h-0.5 w-32 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 origin-center"
            />

            {/* Radiant resonance pulse ring */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.6, 1.4, 1.8], opacity: [0.8, 0.4, 0] }}
              transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
              className="absolute h-20 w-20 rounded-full border border-cyan-400 pointer-events-none"
            />

            {/* Left Node (You) */}
            <motion.div
              initial={{ x: -60, opacity: 0.5 }}
              animate={{ x: -28, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-500/30"
            >
              {isGhostMode ? (
                <Ghost className="h-6 w-6 text-cyan-300" />
              ) : (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-full w-full rounded-full object-cover"
                />
              )}
            </motion.div>

            {/* Central harmonic icon */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 350, damping: 20 }}
              className="relative z-20 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/50"
            >
              <Link2 className="h-4 w-4 stroke-[2.5]" />
            </motion.div>

            {/* Right Node (Target Person) */}
            <motion.div
              initial={{ x: 60, opacity: 0.5 }}
              animate={{ x: 28, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-purple-400 bg-slate-900 shadow-lg shadow-purple-500/30"
            >
              <img
                src={celebratingEchoLink.targetUserAvatar}
                alt={celebratingEchoLink.targetUserName}
                className="h-full w-full rounded-full object-cover"
              />
            </motion.div>
          </div>

          {/* Reveal details */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.25 }}
            className="mt-2 space-y-1"
          >
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Echo Link Formed</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {celebratingEchoLink.targetUserName}
            </h3>
            <p className="text-xs text-slate-300">
              A shared frequency discovered across the Orbit
            </p>
            <div className="pt-2">
              <span className="inline-block rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-0.5 text-[11px] font-medium text-cyan-200">
                {celebratingEchoLink.resonanceType || 'Harmonic Resonance'} · {celebratingEchoLink.strength}% Frequency
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
