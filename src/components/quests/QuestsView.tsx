import React from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Award,
  CheckCircle2,
  Circle,
  Sparkles,
  Gift,
  ArrowRight,
  Radio,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuestsView: React.FC = () => {
  const {
    quests,
    toggleQuestStep,
    claimQuest,
    setCurrentView,
    toggleFrequencies,
    openDrift,
    openCreateMoment,
  } = useNexaStore();

  const handleClaim = (questId: string) => {
    claimQuest(questId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  const getStepAction = (stepTitle?: string) => {
    if (!stepTitle) return null;
    const s = stepTitle.toLowerCase();
    if (s.includes('frequency') || s.includes('band')) {
      return {
        label: 'Tune Frequencies',
        action: () => toggleFrequencies(true),
      };
    }
    if (s.includes('drift')) {
      return {
        label: 'Start Drift',
        action: () => openDrift(true),
      };
    }
    if (s.includes('space') || s.includes('room')) {
      return {
        label: 'Explore Spaces',
        action: () => setCurrentView('spaces'),
      };
    }
    if (s.includes('create') || s.includes('share') || s.includes('post')) {
      return {
        label: 'Create Moment',
        action: () => openCreateMoment(true),
      };
    }
    if (s.includes('resonate') || s.includes('orbit') || s.includes('moment')) {
      return {
        label: 'Visit Orbit',
        action: () => setCurrentView('orbit'),
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-3.5 py-5 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 pb-28 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 mb-5 sm:pb-6 sm:mb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Collective Intentions · Real-World Momentum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Social Quests
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Transformative prompts to wander beyond your algorithmic comfort zone and spark genuine human resonance.
            </p>
          </div>
        </div>

        {/* Quests Grid - Strictly single-column on mobile, 2-column on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5.5">
          {quests.map((quest) => {
            const completedCount = quest.steps.filter((s) => s.completed).length;
            const isAllCompleted = completedCount === quest.steps.length;
            const pct = Math.round((completedCount / quest.steps.length) * 100);

            return (
              <div
                key={quest.id}
                className={`min-w-0 flex flex-col justify-between rounded-2xl border p-4 sm:p-5.5 card-interactive transition-all duration-200 shadow-xs ${
                  quest.isClaimed
                    ? 'border-emerald-500/50 bg-emerald-50/60 dark:border-emerald-500/40 dark:bg-emerald-950/20'
                    : isAllCompleted
                    ? 'border-amber-500/60 bg-amber-50/60 dark:border-amber-500/50 dark:bg-amber-950/20'
                    : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224]'
                }`}
              >
                <div>
                  {/* Quest Header */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-cyan-950 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 shrink-0">
                      {quest.category || quest.difficulty || 'Explore'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      {completedCount} / {quest.steps.length} Steps
                    </span>
                  </div>

                  {/* Title & Description with Natural Word Wrap */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 break-words leading-snug">
                    {quest.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                    {quest.description}
                  </p>

                  {/* Minimal Progress Bar */}
                  <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        quest.isClaimed
                          ? 'bg-emerald-500'
                          : isAllCompleted
                          ? 'bg-amber-500'
                          : 'bg-cyan-600 dark:bg-cyan-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Checklist Steps */}
                  <div className="mt-4 space-y-2">
                    {quest.steps.map((step) => {
                      const stepLabel = step.title || step.text || '';
                      const actionItem = getStepAction(stepLabel);

                      return (
                        <div
                          key={step.id}
                          className={`min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl p-2.5 text-xs sm:text-sm transition-colors border ${
                            step.completed
                              ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              : 'bg-white dark:bg-[#0c1224] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleQuestStep(quest.id, step.id)}
                            className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer select-none min-h-[36px] focus-ring rounded-lg"
                          >
                            <span className="mt-0.5 sm:mt-0 shrink-0">
                              {step.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                              )}
                            </span>
                            <span
                              className={`break-words leading-snug ${
                                step.completed
                                  ? 'line-through text-slate-500 dark:text-slate-400'
                                  : 'font-medium'
                              }`}
                            >
                              {stepLabel}
                            </span>
                          </button>

                          {actionItem && !step.completed && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                actionItem.action();
                              }}
                              className="btn-press focus-ring self-end sm:self-auto shrink-0 inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-2.5 py-1.5 text-[11px] font-bold cursor-pointer min-h-[32px]"
                            >
                              <span>{actionItem.label}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reward & Action - Vertical stack on mobile, horizontal on sm+ */}
                <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 min-w-0 break-words">
                    <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      Reward:{' '}
                      <strong className="text-slate-900 dark:text-slate-100 font-bold">
                        {quest.reward}
                      </strong>
                    </span>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    {quest.isClaimed ? (
                      <span className="block text-center font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-500/40">
                        ✓ Claimed
                      </span>
                    ) : isAllCompleted ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(quest.id)}
                        className="btn-press focus-ring w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 text-center shadow-xs cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Claim Reward</span>
                      </button>
                    ) : (
                      <span className="block text-center font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        {pct}% Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
