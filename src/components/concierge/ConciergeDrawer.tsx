import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  ArrowRight,
  Radio,
  Compass,
} from 'lucide-react';

export const ConciergeDrawer: React.FC = () => {
  const {
    isConciergeOpen,
    toggleConcierge,
    selectedIntent,
    setSelectedIntent,
    setCurrentView,
    socialEnergy,
    spaces,
    moments,
    peopleMatches,
    openSpace,
    inspectMoment,
  } = useNexaStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<
    {
      id: string;
      query: string;
      answer: string;
      recommendations?: {
        title: string;
        actionLabel: string;
        spaceId?: string;
        momentId?: string;
        intent?: any;
        view?: any;
      }[];
    }[]
  >([
    {
      id: 'init',
      query: 'Hello',
      answer: `I'm tuned to NEXA's living Orbit. Currently your social energy is set to "${socialEnergy}" with active intent on "${selectedIntent}". Ask me where minds are gathering or let me navigate you to an active room.`,
      recommendations: [
        {
          title: 'Generative Ambient Radio',
          actionLabel: 'Enter Room',
          spaceId: spaces[0]?.id,
        },
        {
          title: 'Perseid Meteor Watch',
          actionLabel: 'Inspect Moment',
          momentId: moments[1]?.id,
        },
      ],
    },
  ]);

  if (!isConciergeOpen) return null;

  const handleQuery = (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setInputPrompt('');

    setTimeout(() => {
      const p = (promptToSend || '').toLowerCase();

      if (p.includes('creative') || p.includes('energy')) {
        const createMoment = moments.find((m) => m.intent === 'CREATE') || moments[0];
        const creativeSpace = spaces.find((s) => s.category?.toLowerCase().includes('design') || s.category?.toLowerCase().includes('music')) || spaces[0];
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `Creative energy is currently clustered in ${creativeSpace.title} and centered around collaborative audio & modular tools. Here is where resonance is highest right now:`,
            recommendations: [
              { title: creativeSpace.title, actionLabel: 'Open Living Space', spaceId: creativeSpace.id },
              { title: createMoment.title, actionLabel: 'View in Orbit', momentId: createMoment.id },
            ],
          },
        ]);
      } else if (p.includes('sound') || p.includes('music') || p.includes('radio')) {
        const audioSpace = spaces.find((s) => s.category?.toLowerCase().includes('audio') || s.title?.toLowerCase().includes('radio')) || spaces[0];
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `The sound design community is active in "${audioSpace.title}". Live collaborative synth patches and field recordings are transmitting.`,
            recommendations: [
              { title: audioSpace.title, actionLabel: 'Join Session', spaceId: audioSpace.id },
            ],
          },
        ]);
      } else if (p.includes('philosophy') || p.includes('think') || p.includes('someone')) {
        const thinker = peopleMatches.find((pm) => pm.bio?.toLowerCase().includes('philosophy') || pm.sharedCuriosities?.some((c) => c && c.toLowerCase().includes('philosophy'))) || peopleMatches[0];
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `${thinker.name} is currently exploring existential metaphysics and minimal architecture. You have strong complementary curiosities.`,
            recommendations: [
              { title: `Connect with ${thinker.name}`, actionLabel: 'View in People', view: 'matches' },
            ],
          },
        ]);
      } else if (p.includes('happening') || p.includes('orbit')) {
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `Orbit currently has ${moments.length} active live nodes across 8 Intent bands. Resonance activity is peaking around collective creation and discovery.`,
            recommendations: [
              { title: 'Return to Orbit Center', actionLabel: 'Jump to Orbit', view: 'orbit' },
              { title: 'Filter by Discover', actionLabel: 'Set Intent: Discover', intent: 'DISCOVER' },
            ],
          },
        ]);
      } else {
        const matchingSpace =
          spaces.find((s) => s.title?.toLowerCase().includes(p) || s.description?.toLowerCase().includes(p)) ||
          spaces[0];
        const matchingMoment =
          moments.find((m) => m.title?.toLowerCase().includes(p) || m.tags?.some((t) => t && t.toLowerCase().includes(p))) ||
          moments[0];

        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `Located active human nodes aligning with "${promptToSend}":`,
            recommendations: [
              { title: matchingSpace.title, actionLabel: 'Open Space', spaceId: matchingSpace.id },
              { title: matchingMoment.title, actionLabel: 'Inspect Moment', momentId: matchingMoment.id },
            ],
          },
        ]);
      }

      setLoading(false);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md h-full flex flex-col border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0f22] text-slate-900 dark:text-slate-100 shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Concierge</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Context-aware social navigator · Orbit sync
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleConcierge(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Natural Suggested Questions */}
        <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar">
          {[
            'Where is the creative energy right now?',
            'Show me a Space about sound design.',
            'Find someone exploring philosophy.',
            'What’s happening in Orbit?',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleQuery(suggestion)}
              className="rounded-full bg-slate-100 dark:bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300 transition-colors whitespace-nowrap"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {responseLog.map((log) => (
            <div key={log.id} className="space-y-2">
              {log.id !== 'init' && (
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-xs bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-3.5 py-2 max-w-[80%] font-medium">
                    {log.query}
                  </div>
                </div>
              )}

              <div className="rounded-2xl rounded-tl-xs border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-3.5 space-y-2.5">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{log.answer}</p>

                {log.recommendations && (
                  <div className="space-y-1.5 pt-1">
                    {log.recommendations.map((rec, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          toggleConcierge(false);
                          if (rec.spaceId) {
                            openSpace(rec.spaceId);
                          } else if (rec.momentId) {
                            inspectMoment(rec.momentId);
                          } else if (rec.intent) {
                            setSelectedIntent(rec.intent);
                            setCurrentView('orbit');
                          } else if (rec.view) {
                            setCurrentView(rec.view);
                          }
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.03] p-2.5 text-left font-medium text-slate-800 dark:text-slate-200 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="block truncate font-bold text-slate-900 dark:text-white">
                            {rec.title}
                          </span>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400">
                            {rec.actionLabel}
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 p-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              <span>Analyzing the Orbit...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuery();
          }}
          className="p-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask where energy is gathered or what's live..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white shadow-xs transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
