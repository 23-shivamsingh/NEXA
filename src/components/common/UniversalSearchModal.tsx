import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Search,
  X,
  Radio,
  Users,
  Sliders,
  Award,
  BookmarkPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const UniversalSearchModal: React.FC = () => {
  const {
    isUniversalSearchOpen,
    toggleUniversalSearch,
    searchQuery,
    setSearchQuery,
    moments,
    spaces,
    peopleMatches,
    frequencies,
    quests,
    memories,
    inspectMoment,
    openSpace,
    setCurrentView,
    toggleFrequencies,
  } = useNexaStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUniversalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isUniversalSearchOpen]);

  const query = (searchQuery || '').trim().toLowerCase();

  // Grouped search matching
  const matchedMoments = useMemo(() => {
    if (!query) return moments.slice(0, 3);
    return moments.filter(
      (m) =>
        m.title?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query) ||
        m.tags?.some((t) => t && t.toLowerCase().includes(query)) ||
        m.intent?.toLowerCase().includes(query)
    ).slice(0, 4);
  }, [moments, query]);

  const matchedSpaces = useMemo(() => {
    if (!query) return spaces.slice(0, 2);
    return spaces.filter(
      (s) =>
        s.title?.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.category?.toLowerCase().includes(query)
    ).slice(0, 3);
  }, [spaces, query]);

  const matchedPeople = useMemo(() => {
    if (!query) return peopleMatches.slice(0, 2);
    return peopleMatches.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        (p.bio && p.bio.toLowerCase().includes(query)) ||
        (p.sharedCuriosities && p.sharedCuriosities.some((c) => c && c.toLowerCase().includes(query)))
    ).slice(0, 3);
  }, [peopleMatches, query]);

  const matchedFrequencies = useMemo(() => {
    if (!query) return frequencies.slice(0, 2);
    return frequencies.filter(
      (f) =>
        f.category?.toLowerCase().includes(query) ||
        f.description?.toLowerCase().includes(query)
    ).slice(0, 3);
  }, [frequencies, query]);

  const matchedQuests = useMemo(() => {
    if (!query) return quests.slice(0, 2);
    return quests.filter(
      (q) =>
        q.title?.toLowerCase().includes(query) ||
        q.description?.toLowerCase().includes(query) ||
        (q.category && q.category.toLowerCase().includes(query))
    ).slice(0, 2);
  }, [quests, query]);

  const matchedMemories = useMemo(() => {
    if (!query) return memories.slice(0, 2);
    return memories.filter(
      (m) =>
        m.spaceTitle?.toLowerCase().includes(query) ||
        (m.momentTitle && m.momentTitle.toLowerCase().includes(query)) ||
        (m.summary && m.summary.toLowerCase().includes(query)) ||
        (m.tags && m.tags.some((t) => t && t.toLowerCase().includes(query)))
    ).slice(0, 2);
  }, [memories, query]);

  const totalMatches =
    matchedMoments.length +
    matchedSpaces.length +
    matchedPeople.length +
    matchedFrequencies.length +
    matchedQuests.length +
    matchedMemories.length;

  if (!isUniversalSearchOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="universal-search-overlay"
        onClick={() => toggleUniversalSearch(false)}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-4 sm:pt-16 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.16 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090d20] shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Field */}
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 px-4 py-3.5 bg-slate-50/50 dark:bg-white/[0.02]">
            <Search className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              id="universal-search-input"
              type="text"
              placeholder="Search moments, spaces, people, frequencies, quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => toggleUniversalSearch(false)}
              className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
            >
              Esc
            </button>
          </div>

          {/* Quick Frequency Suggestion Chips */}
          {!query && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] text-xs">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Popular:</span>
              {['Ambient Radio', 'Photography', 'Code Jam', 'Philosophy', 'Synth', 'Quiet Space'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="rounded-full bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-cyan-500/15 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors shrink-0"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Grouped Search Results Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {totalMatches === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                No human signals found for "{searchQuery}". Try drifting or tuning your frequencies.
              </div>
            ) : (
              <>
                {/* 1. MOMENTS */}
                {matchedMoments.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      <Radio className="h-3.5 w-3.5" />
                      <span>Moments ({matchedMoments.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedMoments.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            toggleUniversalSearch(false);
                            inspectMoment(m.id);
                          }}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5 hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer transition-all"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {m.title}
                              </span>
                              <span className="rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase text-slate-700 dark:text-slate-300 shrink-0">
                                {m.intent}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {m.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                            <span>{m.participantsCount} here</span>
                            <ArrowRight className="h-3.5 w-3.5 text-cyan-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. SPACES */}
                {matchedSpaces.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                      <Users className="h-3.5 w-3.5" />
                      <span>Living Spaces ({matchedSpaces.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedSpaces.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            toggleUniversalSearch(false);
                            openSpace(s.id);
                          }}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer transition-all"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {s.title}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                              {s.category} · {s.activeParticipants.length} active in room
                            </span>
                          </div>
                          <button className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                            Join Space →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PEOPLE */}
                {matchedPeople.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                      <Users className="h-3.5 w-3.5" />
                      <span>People Signals ({matchedPeople.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchedPeople.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            toggleUniversalSearch(false);
                            setCurrentView('matches');
                          }}
                          className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition-all"
                        >
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                              {p.sharedCuriosities?.[0] || 'Shared Frequency'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. FREQUENCIES */}
                {matchedFrequencies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Frequencies ({matchedFrequencies.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedFrequencies.map((f) => (
                        <div
                          key={f.id}
                          onClick={() => {
                            toggleUniversalSearch(false);
                            toggleFrequencies(true);
                          }}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5 hover:border-sky-500/50 hover:bg-sky-500/5 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{f.icon}</span>
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {f.category}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                                {f.description}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                            {f.strength}% Tune
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. QUESTS */}
                {matchedQuests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                      <Award className="h-3.5 w-3.5" />
                      <span>Social Quests ({matchedQuests.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedQuests.map((q) => (
                        <div
                          key={q.id}
                          onClick={() => {
                            toggleUniversalSearch(false);
                            setCurrentView('quests');
                          }}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer transition-all"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {q.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                              Reward: {q.reward}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            View Quest →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. MEMORIES */}
                {matchedMemories.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                      <BookmarkPlus className="h-3.5 w-3.5" />
                      <span>Saved Memories ({matchedMemories.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedMemories.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            toggleUniversalSearch(false);
                            setCurrentView('memories');
                          }}
                          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5 hover:border-rose-500/50 hover:bg-rose-500/5 cursor-pointer transition-all"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {m.spaceTitle}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                              Preserved {m.preservedAt}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                            Recall →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
