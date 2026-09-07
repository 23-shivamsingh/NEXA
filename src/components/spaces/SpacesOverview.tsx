import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Users,
  Clock,
  ArrowRight,
  Plus,
  Search,
  Ghost,
} from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const SpacesOverview: React.FC = () => {
  const { spaces, openSpace, openCreateMoment } = useNexaStore();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Audio', 'Sprint', 'Debate', 'Stargazing', 'Co-Writing'];

  const filteredSpaces = spaces.filter((space) => {
    if (filterCategory !== 'All') {
      const matchCat = space.category?.toLowerCase().includes(filterCategory.toLowerCase());
      const matchTitle = space.title?.toLowerCase().includes(filterCategory.toLowerCase());
      if (!matchCat && !matchTitle) return false;
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      return Boolean(
        space.title?.toLowerCase().includes(q) ||
        space.description?.toLowerCase().includes(q) ||
        space.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Simple Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Living Spaces
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Ephemeral rooms for real-time focus, shared audio, and co-creation.
            </p>
          </div>

          <button
            onClick={() => openCreateMoment(true)}
            className="btn-press focus-ring inline-flex items-center gap-1.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-xs font-semibold shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Launch Space</span>
          </button>
        </div>

        {/* Minimal Search & Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`chip-interactive focus-ring rounded-full px-3 py-1 text-xs font-medium cursor-pointer whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold shadow-xs'
                    : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus-ring"
            />
          </div>
        </div>

        {/* Simplified Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-5 sm:p-5.5 shadow-xs card-interactive transition-all hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-md dark:hover:shadow-cyan-950/40"
            >
              <div className="min-w-0">
                {/* Category & Time remaining */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-950 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40">
                    {space.category}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{space.expiresAt}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug break-words group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  {space.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed break-words">
                  {space.description}
                </p>

                {/* Participant Avatars preview */}
                <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center -space-x-1.5">
                    {space.activeParticipants.slice(0, 3).map((p, idx) => (
                      <img
                        key={idx}
                        src={p.avatar}
                        alt={p.name}
                        className="h-6 w-6 rounded-full object-cover border-2 border-white dark:border-[#0c1224]"
                      />
                    ))}
                  </div>

                  <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>{space.activeParticipants.length} inside</span>
                  </span>
                </div>
              </div>

              {/* Single Primary Action + Ghost entry option */}
              <div className="mt-5 flex items-center gap-2">
                <Tooltip content="Enter as Ghost (Silent & Anonymous)">
                  <button
                    type="button"
                    onClick={() => openSpace(space.id, true)}
                    aria-label="Enter as Ghost"
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 icon-btn focus-ring cursor-pointer"
                  >
                    <Ghost className="h-4 w-4" />
                  </button>
                </Tooltip>

                <button
                  type="button"
                  onClick={() => openSpace(space.id, false)}
                  className="btn-press focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
                >
                  <span>Enter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Empty State */}
        {filteredSpaces.length === 0 && (
          <div className="rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] p-12 text-center shadow-xs">
            <p className="text-base font-medium text-slate-800 dark:text-slate-200">No active spaces found.</p>
            <button
              onClick={() => openCreateMoment(true)}
              className="mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Launch one now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
