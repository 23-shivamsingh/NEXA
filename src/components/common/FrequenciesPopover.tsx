import React from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  X,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  Radio,
  Cpu,
  Compass,
  Music,
  Eye,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Radio,
  Sparkles,
  Cpu,
  Compass,
  Music,
  Eye,
};

export const FrequenciesPopover: React.FC = () => {
  const {
    frequencies,
    updateFrequency,
    isFrequenciesOpen,
    toggleFrequencies,
    addToast,
  } = useNexaStore();

  if (!isFrequenciesOpen) return null;

  const handleReset = () => {
    frequencies.forEach((f) => {
      updateFrequency(f.id, 65);
    });
    addToast('Frequencies reset to harmonic equilibrium (65%)', 'info');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={() => toggleFrequencies(false)}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tune Frequencies
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust interest resonance to pull moments closer in Orbit
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleFrequencies(false)}
            className="rounded-full p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Frequencies List */}
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
          {frequencies.map((freq) => {
            const Icon = ICON_MAP[freq.icon] || Sparkles;
            return (
              <div
                key={freq.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {freq.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800">
                    {freq.strength}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                  {freq.description}
                </p>

                {/* Range Slider with High Contrast Styling */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Quiet</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={freq.strength}
                    onChange={(e) => updateFrequency(freq.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Amplified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Equilibrium</span>
          </button>

          <button
            onClick={() => {
              toggleFrequencies(false);
              addToast('Orbit tuned to your updated frequencies', 'aura');
            }}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Apply to Orbit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
