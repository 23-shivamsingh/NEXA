import React from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  X,
  Sparkles,
  Compass,
  Radio,
  Heart,
  Lightbulb,
  Link,
  Check,
  BookmarkPlus,
} from 'lucide-react';

export const SessionMemoryModal: React.FC = () => {
  const {
    isSessionMemoryOpen,
    toggleSessionMemory,
    sessionStats,
    saveMemory,
    addToast,
    socialEnergy,
  } = useNexaStore();

  if (!isSessionMemoryOpen) return null;

  const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStats.startTime) / 60000));

  const handlePreserveSession = () => {
    saveMemory({
      spaceTitle: `Session Pulse: ${socialEnergy} Exploration`,
      summary: `Reflective session spanning ${durationMinutes}m. Recorded ${sessionStats.resonancesRecorded} resonances, contributed ${sessionStats.ideasContributed} ideas, and formed ${sessionStats.linksFormed} echo links without passive scrolling.`,
      keyArtifacts: [
        { type: 'text', title: 'Energy State', content: `${socialEnergy} Focus` },
        { type: 'tags', title: 'Interactions', content: `${sessionStats.resonancesRecorded} Resonances, ${sessionStats.linksFormed} Echo Links` },
      ],
      collaborators: [],
      tags: ['session-memory', 'reflection', (socialEnergy || 'social').toLowerCase()],
      coordinates: { x: 50, y: 50 },
      preservedAt: 'Just now',
    });
    toggleSessionMemory(false);
    addToast('Session preserved into your Memory Garden', 'aura');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={() => toggleSessionMemory(false)}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0b1024] p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Session Memory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A non-extractive reflection of your meaningful activity
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleSessionMemory(false)}
            className="rounded-full p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Narrative Summary */}
        <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            {socialEnergy} Session Pulse
          </span>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            Over the past {durationMinutes} minutes, your presence contributed to living communal spaces without passive algorithmic consumption.
          </p>

          {/* Metric Badges */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-700/80 text-center">
              <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {sessionStats.resonancesRecorded}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Resonances
              </div>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-700/80 text-center">
              <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                {sessionStats.ideasContributed}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Ideas Shared
              </div>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-700/80 text-center">
              <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                {sessionStats.linksFormed}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Echo Links
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Philosophy Callout */}
        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <Compass className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-bold">No streaks, no guilt:</strong> NEXA has no daily engagement mandates. Leave when satisfied and return whenever you feel called to co-create.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={handlePreserveSession}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            <span>Preserve to Garden</span>
          </button>

          <button
            onClick={() => toggleSessionMemory(false)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Continue Orbit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
