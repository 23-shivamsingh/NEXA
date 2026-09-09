import React, { useEffect } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { IntentContract, Intent } from '../../types';
import {
  ShieldCheck,
  X,
  Sparkles,
  Palette,
  Compass,
  HeartHandshake,
  BookOpen,
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const INTENTION_PRESETS: {
  label: string;
  intent: Intent;
  statement: string;
  icon: typeof Sparkles;
  accent: string;
  description: string;
}[] = [
  {
    label: 'I want to make something',
    intent: 'CREATE',
    statement: 'I am entering NEXA to build, brainstorm, or co-create with other humans.',
    icon: Palette,
    accent: 'purple',
    description: 'Brings collaborative canvases, prototype jams, and creative workshops into orbit.',
  },
  {
    label: 'I want to learn',
    intent: 'LEARN',
    statement: 'I am here to acquire deep perspective or explore technical and philosophical concepts.',
    icon: BookOpen,
    accent: 'indigo',
    description: 'Prioritizes study rooms, architectural reviews, and peer-learning discussions.',
  },
  {
    label: 'I want to meet people around one idea',
    intent: 'CONNECT',
    statement: 'I want to forge genuine Echo Links with people sharing my specific curiosities.',
    icon: HeartHandshake,
    accent: 'sky',
    description: 'Highlights active living spaces with open seats and high conversational harmony.',
  },
  {
    label: 'I want to help someone',
    intent: 'HELP',
    statement: 'I have energy to unblock others, offer feedback, or assist in open community quests.',
    icon: Zap,
    accent: 'emerald',
    description: 'Surfaces moments actively requesting collaborators, reviewers, or testers.',
  },
  {
    label: 'I want to explore something unexpected',
    intent: 'DISCOVER',
    statement: 'I want serendipitous exposure outside my habitual bubble and echo chambers.',
    icon: Compass,
    accent: 'cyan',
    description: 'Engages high drift and wide orbits, featuring eclectic human moments.',
  },
  {
    label: 'I just want to vibe',
    intent: 'JUST VIBE',
    statement: 'I want low-pressure ambient co-presence with zero expectation to perform.',
    icon: Radio,
    accent: 'rose',
    description: 'Focuses on generative soundscapes, stargazing rooms, and silent co-working.',
  },
];

export const IntentContractModal: React.FC = () => {
  const isIntentContractOpen = useNexaStore((state) => state.isIntentContractOpen);
  const toggleIntentContract = useNexaStore((state) => state.toggleIntentContract);
  const activeIntentContract = useNexaStore((state) => state.activeIntentContract);
  const setIntentContract = useNexaStore((state) => state.setIntentContract);

  // Close on Escape
  useEffect(() => {
    if (!isIntentContractOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleIntentContract(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntentContractOpen, toggleIntentContract]);

  if (!isIntentContractOpen) return null;

  const handleSelectPreset = (preset: (typeof INTENTION_PRESETS)[0]) => {
    const newContract: IntentContract = {
      id: `contract-${Date.now()}`,
      label: preset.label,
      intent: preset.intent,
      statement: preset.statement,
      antiExtractionPledge:
        'Zero algorithmic feeds. Your attention is sovereign. NEXA optimizes for fulfillment, not time spent.',
      durationMinutes: 30,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setIntentContract(newContract);
    toggleIntentContract(false);
  };

  const handleRelease = () => {
    setIntentContract(null);
    toggleIntentContract(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intent-contract-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => toggleIntentContract(false)}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="intent-contract-title" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Social Intent Contract
                </h2>
                <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  Anti-Feed
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Declare your purpose before entering the Orbit. NEXA serves your conscious goal, never an ad model.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleIntentContract(false)}
            className="icon-btn focus-ring rounded-full p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            aria-label="Close Intent Contract modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Active Contract Status Banner */}
        {activeIntentContract && (
          <div className="my-3 rounded-2xl border border-cyan-500/30 bg-cyan-50/70 dark:bg-cyan-950/30 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Active Session Contract:</span>
                  <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{activeIntentContract.label}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>Initiated at {activeIntentContract.startedAt} • Sovereign session</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleRelease}
              className="btn-press focus-ring shrink-0 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              Release Contract
            </button>
          </div>
        )}

        {/* Presets List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 no-scrollbar">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-1">
            Choose your intentional state:
          </div>

          {INTENTION_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = activeIntentContract?.intent === preset.intent;
            return (
              <button
                key={preset.intent}
                onClick={() => handleSelectPreset(preset)}
                className={`w-full text-left rounded-2xl p-3.5 border transition-all cursor-pointer focus-ring flex items-start gap-3 min-h-[44px] ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/15 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100/80 dark:hover:bg-white/[0.05]'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      "{preset.label}"
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      {preset.intent}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    {preset.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Anti-Extraction Pledge Footer */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
          <div className="rounded-2xl bg-slate-100 dark:bg-white/[0.03] p-3 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200 font-semibold">
                The Anti-Extraction Contract:
              </strong>{' '}
              NEXA guarantees zero algorithmic rabbit holes, vanity like counts, or passive doomscrolling. Your time is measured by intentional fulfillment, not retention metrics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
