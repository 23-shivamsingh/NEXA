import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  X,
  Compass,
  ArrowRight,
  Sparkles,
  Radio,
  Clock,
  Users,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react';

export const DriftModal: React.FC = () => {
  const {
    isDriftOpen,
    openDrift,
    moments,
    openSpace,
    inspectMoment,
    addToast,
  } = useNexaStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visitedTrail, setVisitedTrail] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isDriftOpen) return null;

  // Filter moments suitable for drifting (shuffle slightly based on index)
  const driftPool = moments.slice(0, 10);
  const currentMoment = driftPool[currentIndex % driftPool.length];

  const handleNext = () => {
    if (visitedTrail.length >= 4) {
      setIsCompleted(true);
      return;
    }
    const newTrail = [...visitedTrail, currentMoment.tags[0] || currentMoment.intent];
    setVisitedTrail(newTrail);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDriftIn = () => {
    openDrift(false);
    inspectMoment(currentMoment.id);
    addToast(`Drifted into: "${currentMoment.title}"`, 'aura');
  };

  const handleReset = () => {
    setVisitedTrail([]);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={() => openDrift(false)}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0b1024] p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Drift Exploration
                </h2>
                <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold px-2 py-0.5 border border-cyan-300 dark:border-cyan-800">
                  {visitedTrail.length + 1} of 5
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Serendipitous discovery without an algorithmic feed
              </p>
            </div>
          </div>

          <button
            onClick={() => openDrift(false)}
            className="rounded-full p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Breadcrumb Trail */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
            Trail:
          </span>
          {visitedTrail.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {item}
              </span>
              <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            </React.Fragment>
          ))}
          <span className="rounded-md bg-cyan-100 dark:bg-cyan-950/80 px-2 py-0.5 font-bold text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
            {currentMoment.tags[0] || currentMoment.intent}
          </span>
        </div>

        {/* Body: Either Single Moment Card or Drift Completed Reflection */}
        {!isCompleted ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/60 p-5 transition-all">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-600">
                  {currentMoment.intent}
                </span>

                <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{currentMoment.expiresAt} left</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentMoment.title}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <img
                  src={currentMoment.creator.avatar}
                  alt={currentMoment.creator.name}
                  className="h-5 w-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <span>By <strong className="text-slate-900 dark:text-slate-200">{currentMoment.creator.name}</strong></span>
              </div>

              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentMoment.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {currentMoment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  {currentMoment.participantsCount} participants active
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {currentMoment.currentActivity}
                </span>
              </div>
            </div>

            {/* Drift Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>Pass & Keep Drifting</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleDriftIn}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-3 text-xs font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Drift In</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Intentional Stopping Point */
          <div className="mt-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-3 border border-cyan-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Drift Complete
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              You wandered across 5 unexpected human intersections without being trapped in an algorithmic vortex.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {visitedTrail.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Drift Again</span>
              </button>

              <button
                onClick={() => openDrift(false)}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Return to Orbit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
