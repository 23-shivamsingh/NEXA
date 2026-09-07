import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { RemixItem } from '../../types';
import {
  X,
  Repeat,
  Sparkles,
  Music,
  HelpCircle,
  FileText,
  Users,
  ArrowRight,
  GitBranch,
} from 'lucide-react';

const REMIX_TYPES: { type: RemixItem['remixType']; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { type: 'expand_thought', label: 'Expand the Thought', icon: FileText, desc: 'Deepen the philosophical or practical exploration' },
  { type: 'musical_layer', label: 'Add Musical Layer', icon: Music, desc: 'Pair this concept with a sonic stem or acoustic vibe' },
  { type: 'challenge_spin', label: 'Spin into a Challenge', icon: HelpCircle, desc: 'Turn the question into an active community quest' },
  { type: 'living_space', label: 'Spawn Living Space', icon: Users, desc: 'Open a real-time room to work on this together' },
  { type: 'format_translation', label: 'Format Translation', icon: GitBranch, desc: 'Convert to visual diagram, poetry, or code snippet' },
];

export const RemixModal: React.FC = () => {
  const { isRemixingMomentId, openRemixModal, moments, addRemix } = useNexaStore();

  const moment = moments.find((m) => m.id === isRemixingMomentId);

  const [remixType, setRemixType] = useState<RemixItem['remixType']>('expand_thought');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  if (!isRemixingMomentId || !moment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addRemix({
      originalMomentId: moment.id,
      originalTitle: moment.title,
      originalCreator: moment.creator.name,
      remixType,
      newTitle: newTitle.trim(),
      newDescription: newDescription.trim() || `Remixed variation branched from "${moment.title}".`,
      tags: [...moment.tags, 'remix', remixType],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 dark:border-purple-500/30 bg-white dark:bg-[#080d1c] p-6 shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Lineage-Preserving Remix Engine
              </span>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Branch a New Idea</h2>
            </div>
          </div>

          <button
            onClick={() => openRemixModal(null)}
            className="icon-btn focus-ring flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Close remix dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Original Lineage Box */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-3.5 mb-5 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-purple-700 dark:text-purple-300 font-semibold mb-1">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Root Ancestor:</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white truncate">"{moment.title}"</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Originated by {moment.creator.name} · Intent: {moment.intent}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Select Remix Branch Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REMIX_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = remixType === type.type;
                return (
                  <button
                    type="button"
                    key={type.type}
                    onClick={() => setRemixType(type.type)}
                    className={`chip-interactive focus-ring flex items-start gap-2.5 rounded-xl border p-3 text-left cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-950 dark:text-white shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold block text-slate-900 dark:text-white">{type.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">{type.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Remix Title</label>
            <input
              type="text"
              placeholder={`e.g. Counter-perspective on ${moment.title.slice(0, 24)}...`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/40 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Elaboration / Added Value</label>
            <textarea
              rows={3}
              placeholder="What unique synthesis, audio stem, or perspective are you weaving into this root?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/40 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => openRemixModal(null)}
              className="btn-press focus-ring rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-press focus-ring flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              <span>Publish Remix to Horizon</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
