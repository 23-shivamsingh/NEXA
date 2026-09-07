import React from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Sparkles,
  Link2,
  Check,
  Radio,
} from 'lucide-react';

export const MatchesView: React.FC = () => {
  const { peopleMatches, echoLinks, forgeEchoLinkWithUser, addToast } = useNexaStore();

  const handleConnect = (person: (typeof peopleMatches)[0]) => {
    forgeEchoLinkWithUser(person);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Signals · No Follower Ranks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              People
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Minds exploring complementary curiosities, mutual resonance, and living spaces.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {peopleMatches.map((person) => {
            const isLinked = echoLinks.some((l) => l.targetUserName === person.name);

            return (
              <div
                key={person.id}
                className="card-interactive flex flex-col justify-between rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-5 sm:p-5.5 shadow-xs transition-all hover:border-cyan-500 dark:hover:border-cyan-400"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-50 truncate">
                        {person.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                        <Radio className="h-3 w-3 text-cyan-500 animate-pulse" />
                        <span>Harmonic Resonance</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {person.bio || person.headline}
                  </p>

                  {/* Shared Curiosities */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Complementary Curiosities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(person.sharedCuriosities || person.sharedInterests || []).map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                  {isLinked ? (
                    <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 py-2 text-xs font-bold">
                      <Check className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Echo Linked</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnect(person)}
                      className="btn-press focus-ring flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 py-2 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <Link2 className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>✦ Forge Echo Link</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
