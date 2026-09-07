import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Radio,
  Users,
  HeartHandshake,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useNexaStore } from '../../store/useNexaStore';
import { Intent } from '../../types';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTENT_PRESETS: { id: Intent; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'CREATE', label: 'Create' },
  { id: 'DISCOVER', label: 'Discover' },
  { id: 'CONNECT', label: 'Connect' },
  { id: 'LEARN', label: 'Learn' },
  { id: 'JUST VIBE', label: 'Just Vibe' },
];

export const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedIntent,
    setSelectedIntent,
    moments,
    spaces,
    peopleMatches,
    inspectMoment,
    openSpace,
    setCurrentView,
  } = useNexaStore();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const query = (searchQuery || '').trim().toLowerCase();

  // Filtered moments
  const matchedMoments = moments.filter((m) => {
    if (selectedIntent !== 'ALL' && m.intent !== selectedIntent) return false;
    if (!query) return true;
    return (
      m.title?.toLowerCase().includes(query) ||
      m.description?.toLowerCase().includes(query) ||
      m.tags?.some((t) => t && t.toLowerCase().includes(query))
    );
  }).slice(0, 5);

  // Filtered spaces
  const matchedSpaces = spaces.filter((s) => {
    if (!query) return true;
    return (
      s.title?.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query) ||
      s.category?.toLowerCase().includes(query)
    );
  }).slice(0, 3);

  // Filtered people
  const matchedPeople = peopleMatches.filter((p) => {
    if (!query) return true;
    return (
      p.name?.toLowerCase().includes(query) ||
      (p.bio && p.bio.toLowerCase().includes(query)) ||
      (p.sharedCuriosities && p.sharedCuriosities.some((c) => c && c.toLowerCase().includes(query)))
    );
  }).slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#070b18] text-slate-900 dark:text-slate-100 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Search Input Bar (56px) */}
          <div className="flex h-14 items-center gap-2 border-b border-slate-200 dark:border-white/10 px-3 bg-white/90 dark:bg-[#070b18]/90 backdrop-blur-md">
            <Search className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={inputRef}
              id="mobile-search-input-field"
              type="text"
              placeholder="Search moments, spaces, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              id="mobile-search-cancel-btn"
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:opacity-80"
            >
              Cancel
            </button>
          </div>

          {/* Quick Intent Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-white/[0.05] p-2.5 bg-slate-50/50 dark:bg-white/[0.01]">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1 shrink-0">
              Vibe:
            </span>
            {INTENT_PRESETS.map((p) => {
              const isSelected = selectedIntent === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedIntent(p.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-cyan-600 dark:bg-cyan-500/20 text-white dark:text-cyan-300 font-semibold'
                      : 'bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Results Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Matching Moments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Moments in Orbit ({matchedMoments.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {matchedMoments.map((moment) => (
                  <button
                    key={moment.id}
                    onClick={() => {
                      inspectMoment(moment.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-3 text-left hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                          style={{
                            backgroundColor: `${moment.accentColor}20`,
                            color: moment.accentColor,
                          }}
                        >
                          {moment.intent}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {moment.expiresAt}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {moment.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {moment.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                ))}
                {matchedMoments.length === 0 && (
                  <p className="text-xs text-slate-400 py-1">No moments found.</p>
                )}
              </div>
            </div>

            {/* Matching Spaces */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-500" />
                  <span>Living Spaces ({matchedSpaces.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {matchedSpaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => {
                      openSpace(space.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-3 text-left hover:border-purple-500/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {space.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {space.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Matching People */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
                  <span>People ({matchedPeople.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {matchedPeople.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => {
                      setCurrentView('matches');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-3 text-left hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {person.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {person.bio}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
