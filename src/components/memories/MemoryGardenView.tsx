import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { Memory } from '../../types';
import {
  Sparkles,
  Music,
  FileText,
  Users,
  RotateCcw,
  Trash2,
  Share2,
} from 'lucide-react';

export const MemoryGardenView: React.FC = () => {
  const { memories, deleteMemory, createMoment, openSpace, addToast } = useNexaStore();
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(memories[0]?.id || null);

  const selectedMemory = memories.find((m) => m.id === selectedMemoryId) || memories[0];

  const handleRekindle = (memory: Memory) => {
    const collabs = memory.collaborators || memory.participants || [];
    const rekindled = createMoment({
      title: `Rekindled: ${memory.spaceTitle}`,
      intent: 'CREATE',
      description: `Re-opening collaboration inspired by "${memory.spaceTitle}". ${memory.summary || memory.outcome || ''}`,
      durationLabel: '1 Hour',
      lookingFor: collabs.map((c) => c.name),
      tags: [...(memory.tags || []), 'rekindled'],
      privacy: 'Open Orbit',
    });
    openSpace(rekindled.spaceId);
  };

  const handleShare = (title: string) => {
    navigator.clipboard?.writeText(`Saved on NEXA: ${title}`);
    addToast('Memory link copied to clipboard', 'info');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 mb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Memory Garden
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Saved artifacts, playlists, and reflections preserved from past spaces.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {memories.length} saved memories
          </span>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column: Memories List */}
          <div className="space-y-3 md:col-span-5">
            {memories.map((mem) => {
              const isSelected = selectedMemory?.id === mem.id;
              return (
                <div
                  key={mem.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedMemoryId(mem.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMemoryId(mem.id);
                    }
                  }}
                  className={`card-interactive focus-ring cursor-pointer rounded-2xl border p-4.5 transition-all duration-150 shadow-xs ${
                    isSelected
                      ? 'border-cyan-500 ring-2 ring-cyan-500 bg-cyan-50/70 dark:border-cyan-400 dark:ring-cyan-400 dark:bg-slate-900'
                      : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] hover:border-cyan-500 dark:hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{mem.preservedAt}</span>
                    <span className="text-xs uppercase font-bold text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-500/40">
                      {mem.tags?.[0] || 'Space'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-50 line-clamp-1">
                    {mem.spaceTitle}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {mem.summary || mem.outcome}
                  </p>
                </div>
              );
            })}

            {memories.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                No memories saved yet. Preserve a Living Space before it dissolves.
              </div>
            )}
          </div>

          {/* Right Column: Selected Memory Detail */}
          {selectedMemory ? (
            <div className="md:col-span-7">
              <div className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">
                    Preserved {selectedMemory.preservedAt}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleShare(selectedMemory.spaceTitle)}
                      className="icon-btn focus-ring rounded-lg p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                      title="Share link"
                      aria-label="Share memory link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMemory(selectedMemory.id)}
                      className="icon-btn focus-ring rounded-lg p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer"
                      title="Delete memory"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {selectedMemory.spaceTitle}
                </h2>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedMemory.summary || selectedMemory.outcome}
                </p>

                {/* Key Artifacts */}
                {selectedMemory.keyArtifacts && selectedMemory.keyArtifacts.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Artifacts
                    </span>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {selectedMemory.keyArtifacts.map((art, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {art.type === 'music' ? (
                              <Music className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                            ) : (
                              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            )}
                            <span>{art.title}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                            {art.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaborators */}
                {selectedMemory.collaborators && selectedMemory.collaborators.length > 0 && (
                  <div className="mt-5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Collaborators
                    </span>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {selectedMemory.collaborators.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 pl-1 pr-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          <img src={c.avatar} alt={c.name} className="h-6 w-6 rounded-full object-cover" />
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rekindle Primary CTA */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRekindle(selectedMemory)}
                    className="btn-press focus-ring flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Rekindle into Live Moment</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:col-span-7 flex items-center justify-center p-8 text-sm font-medium text-slate-700 dark:text-slate-300">
              Select a memory to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
