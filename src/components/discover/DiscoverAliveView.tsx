import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Flame,
  Clock,
  Users,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const INTENT_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  CREATE: {
    bg: 'bg-purple-100 dark:bg-purple-950/80',
    text: 'text-purple-900 dark:text-purple-200',
    border: 'border-purple-300 dark:border-purple-500/40',
  },
  CONNECT: {
    bg: 'bg-sky-100 dark:bg-sky-950/80',
    text: 'text-sky-900 dark:text-sky-200',
    border: 'border-sky-300 dark:border-sky-500/40',
  },
  LEARN: {
    bg: 'bg-indigo-100 dark:bg-indigo-950/80',
    text: 'text-indigo-900 dark:text-indigo-200',
    border: 'border-indigo-300 dark:border-indigo-500/40',
  },
  PLAY: {
    bg: 'bg-amber-100 dark:bg-amber-950/80',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-500/40',
  },
  HELP: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/80',
    text: 'text-emerald-900 dark:text-emerald-200',
    border: 'border-emerald-300 dark:border-emerald-500/40',
  },
  DISCOVER: {
    bg: 'bg-cyan-100 dark:bg-cyan-950/80',
    text: 'text-cyan-950 dark:text-cyan-200',
    border: 'border-cyan-300 dark:border-cyan-500/40',
  },
  'JUST VIBE': {
    bg: 'bg-rose-100 dark:bg-rose-950/80',
    text: 'text-rose-900 dark:text-rose-200',
    border: 'border-rose-300 dark:border-rose-500/40',
  },
};

const getBadgeStyle = (intent: string) => {
  return (
    INTENT_BADGES[intent] || {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'border-slate-300 dark:border-slate-700',
    }
  );
};

export const DiscoverAliveView: React.FC = () => {
  const { moments, inspectMoment, selectedIntent, inspectingMomentId, activeIntentContract } = useNexaStore();
  const [sortMode, setSortMode] = useState<'momentum' | 'expiring_soon'>('momentum');

  const filtered = moments.filter((m) => {
    if (selectedIntent !== 'ALL' && m.intent !== selectedIntent) return false;
    return true;
  });

  const sortedMoments = [...filtered].sort((a, b) => {
    // If user has an active Intent Contract, deterministically surface aligned moments first
    if (activeIntentContract) {
      const aMatches = a.intent === activeIntentContract.intent;
      const bMatches = b.intent === activeIntentContract.intent;
      if (aMatches !== bMatches) return aMatches ? -1 : 1;
    }
    if (sortMode === 'expiring_soon') {
      return a.expiresAt.localeCompare(b.expiresAt);
    }
    return b.participantsCount - a.participantsCount;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-slate-300 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Alive Now
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Moments where people are currently active and co-creating.
            </p>
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] p-1 text-xs shadow-xs">
            <button
              onClick={() => setSortMode('momentum')}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition-colors cursor-pointer ${
                sortMode === 'momentum'
                  ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Most Active
            </button>
            <button
              onClick={() => setSortMode('expiring_soon')}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition-colors cursor-pointer ${
                sortMode === 'expiring_soon'
                  ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ending Soon
            </button>
          </div>
        </div>

        {/* Moments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedMoments.map((moment) => {
            const badge = getBadgeStyle(moment.intent);
            const isSelected = inspectingMomentId === moment.id;

            return (
              <div
                key={moment.id}
                onClick={() => inspectMoment(moment.id)}
                className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-5 sm:p-5.5 transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-500 ring-2 ring-cyan-500 bg-cyan-50/50 dark:border-cyan-400 dark:ring-cyan-400 dark:bg-slate-900 shadow-md'
                    : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-md dark:hover:shadow-cyan-950/40 hover:-translate-y-0.5 shadow-xs'
                }`}
              >
                <div className="min-w-0">
                  {/* 1. Category + Timer */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {moment.intent}
                      </span>
                      {activeIntentContract && activeIntentContract.intent === moment.intent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Intent Match</span>
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{moment.expiresAt}</span>
                    </span>
                  </div>

                  {/* 2. Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug break-words group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                    {moment.title}
                  </h3>

                  {/* 3. Short Description */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed break-words">
                    {moment.description}
                  </p>
                </div>

                {/* Footer: 4. Participant count & 5. Primary Join action */}
                <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>{moment.participantsCount} here</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      inspectMoment(moment.id);
                    }}
                    className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold px-4 py-1.5 text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
