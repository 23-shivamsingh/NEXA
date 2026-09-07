import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { Intent } from '../../types';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Compass,
} from 'lucide-react';

const INTENTS: { id: Intent; label: string; icon: string; desc: string }[] = [
  { id: 'CREATE', label: 'Create', icon: '⚡', desc: 'Collaborate on design, music, code, or writing' },
  { id: 'JUST VIBE', label: 'Just Vibe', icon: '🌊', desc: 'Low pressure co-presence and ambient focus' },
  { id: 'CONNECT', label: 'Connect', icon: '🤝', desc: 'Real-time conversation and mutual interests' },
  { id: 'LEARN', label: 'Learn', icon: '🌱', desc: 'Skill exchange, study circle, or deep dive' },
  { id: 'DISCOVER', label: 'Discover', icon: '🧭', desc: 'Explore niche curiosities and stargazing' },
  { id: 'PLAY', label: 'Play', icon: '🎲', desc: 'Trivia, games, and creative challenges' },
];

const DURATIONS = [
  { label: '30 Min', value: '30m' },
  { label: '1 Hour', value: '1h' },
  { label: '3 Hours', value: '3h' },
  { label: '24 Hours', value: '24h' },
];

export const CreateMomentModal: React.FC = () => {
  const { isCreatingMoment, openCreateMoment, createMoment, openSpace } = useNexaStore();

  const [step, setStep] = useState<number>(1);
  const [intent, setIntent] = useState<Intent>('CREATE');
  const [whatSeeking, setWhatSeeking] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<string>('1 Hour');

  if (!isCreatingMoment) return null;

  const handleClose = () => {
    openCreateMoment(false);
    setStep(1);
  };

  const handleLaunch = () => {
    const launched = createMoment({
      title: title.trim() || 'Ephemeral Moment',
      intent,
      description: whatSeeking.trim() || 'Gathering around a shared spark.',
      durationLabel: duration,
      lookingFor: ['Collaborator'],
      tags: [(intent || 'DISCOVER').toLowerCase(), 'live'],
      privacy: 'Open Orbit',
    });
    openCreateMoment(false);
    openSpace(launched.spaceId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0f22] p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Step {step} of 5
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {step === 1 && 'Choose Your Intent'}
              {step === 2 && 'What Are You Exploring?'}
              {step === 3 && 'Name This Moment'}
              {step === 4 && 'Choose Duration'}
              {step === 5 && 'Ready to Launch'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="icon-btn focus-ring rounded-full p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step 1: Intent Selection (Large touch-friendly cards) */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2.5 my-2">
            {INTENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIntent(item.id);
                  setStep(2);
                }}
                className={`card-interactive focus-ring flex flex-col items-start p-3.5 rounded-2xl border text-left cursor-pointer ${
                  intent === item.id
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/15 text-cyan-900 dark:text-cyan-200 shadow-xs'
                    : 'border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/15'
                }`}
              >
                <span className="text-2xl mb-1.5">{item.icon}</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{item.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: What do you want? */}
        {step === 2 && (
          <div className="my-3 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One short sentence describing what you want to experience or build right now.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Looking for 2 people to listen to ambient records and sketch ideas."
              value={whatSeeking}
              onChange={(e) => setWhatSeeking(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Step 3: Title */}
        {step === 3 && (
          <div className="my-3 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep it punchy (2-4 words).
            </p>
            <input
              type="text"
              placeholder="e.g. Ambient Record Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Step 4: Duration */}
        {step === 4 && (
          <div className="my-3 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Moments dissolve when time expires, keeping NEXA alive and ephemeral.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {DURATIONS.map((dur) => (
                <button
                  key={dur.label}
                  onClick={() => setDuration(dur.label)}
                  className={`chip-interactive focus-ring flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer ${
                    duration === dur.label
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/15 text-cyan-900 dark:text-cyan-200 font-semibold shadow-xs'
                      : 'border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs">{dur.label}</span>
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Publish & Review */}
        {step === 5 && (
          <div className="my-3 space-y-3 text-xs">
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-4 border border-slate-100 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider text-[10px]">
                  {intent}
                </span>
                <span className="text-slate-400">{duration}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {title || 'Untitled Moment'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                {whatSeeking || 'No description provided.'}
              </p>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-press focus-ring flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-press focus-ring flex items-center gap-1 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 px-4 py-2 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              className="btn-press focus-ring flex items-center gap-1.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 text-xs font-bold shadow-md cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch Moment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
