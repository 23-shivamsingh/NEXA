import React, { useState } from "react";
import { useNexaStore, ViewMode } from "../../store/useNexaStore";
import { Intent } from "../../types";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  ArrowRight,
  Radio,
  Users,
  Target,
  Clock,
  Compass,
} from "lucide-react";

interface RecommendationItem {
  title: string;
  actionLabel: string;
  spaceId?: string;
  momentId?: string;
  intent?: Intent;
  view?: ViewMode;
  subtitle?: string;
}

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

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [transitioningDestination, setTransitioningDestination] = useState<
    string | null
  >(null);

  const [responseLog, setResponseLog] = useState<
    {
      id: string;
      query: string;
      answer: string;
      recommendations?: RecommendationItem[];
    }[]
  >([
    {
      id: "init",
      query: "Hello",
      answer: `I'm tuned to NEXA's living Orbit. Your social energy is calibrated to "${socialEnergy}" with active intent on "${selectedIntent}". Ask me where minds are gathering or let me navigate you into a live space:`,
      recommendations: [
        {
          title: spaces[0]?.title || "Generative Ambient Radio",
          actionLabel: "Enter Living Space",
          spaceId: spaces[0]?.id,
          subtitle:
            "Live collaborative audio synthesis & shared frequency stream",
        },
        {
          title: moments[1]?.title || "Perseid Meteor Watch",
          actionLabel: "Inspect Moment",
          momentId: moments[1]?.id,
          subtitle: "Synchronous night-sky observation in Orbit",
        },
      ],
    },
  ]);

  if (!isConciergeOpen) return null;

  const handleQuery = (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setInputPrompt("");

    setTimeout(() => {
      const p = (promptToSend || "").toLowerCase();

      if (p.includes("creative") || p.includes("energy")) {
        const createMoment =
          moments.find((m) => m.intent === "CREATE") || moments[0];
        const creativeSpace =
          spaces.find(
            (s) =>
              s.category?.toLowerCase().includes("design") ||
              s.category?.toLowerCase().includes("music"),
          ) || spaces[0];
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `Creative energy is currently clustered in "${creativeSpace.title}" and centered around modular tools and shared prototypes. Here is where resonance is peaking:`,
            recommendations: [
              {
                title: creativeSpace.title,
                actionLabel: "Enter Living Space",
                spaceId: creativeSpace.id,
                subtitle: creativeSpace.description,
              },
              {
                title: createMoment.title,
                actionLabel: "Inspect in Orbit",
                momentId: createMoment.id,
                subtitle: createMoment.description.slice(0, 70) + "...",
              },
            ],
          },
        ]);
      } else if (
        p.includes("sound") ||
        p.includes("music") ||
        p.includes("radio")
      ) {
        const audioSpace =
          spaces.find(
            (s) =>
              s.category?.toLowerCase().includes("audio") ||
              s.title?.toLowerCase().includes("radio"),
          ) || spaces[0];
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `The sound design community is synchronized in "${audioSpace.title}". Live collaborative synth patches and field recordings are transmitting.`,
            recommendations: [
              {
                title: audioSpace.title,
                actionLabel: "Join Session",
                spaceId: audioSpace.id,
                subtitle: audioSpace.description,
              },
            ],
          },
        ]);
      } else if (
        p.includes("philosophy") ||
        p.includes("think") ||
        p.includes("someone")
      ) {
        const thinker =
          peopleMatches.find(
            (pm) =>
              pm.bio?.toLowerCase().includes("philosophy") ||
              pm.sharedCuriosities?.some(
                (c) => c && c.toLowerCase().includes("philosophy"),
              ),
          ) || peopleMatches[0];
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `${thinker.name} is currently exploring existential metaphysics and minimal architecture. You have strong complementary curiosities.`,
            recommendations: [
              {
                title: `Connect with ${thinker.name}`,
                actionLabel: "View in People",
                view: "matches",
                subtitle:
                  thinker.bio || "Exploring metaphysics and deep curiosity",
              },
            ],
          },
        ]);
      } else if (p.includes("happening") || p.includes("orbit")) {
        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `Orbit currently has ${moments.length} active live nodes across 8 Intent bands. Resonance activity is peaking around collective creation and discovery.`,
            recommendations: [
              {
                title: "Return to Orbit Center",
                actionLabel: "Jump to Orbit",
                view: "orbit",
                subtitle: "Dynamic 3D-inspired living constellation view",
              },
              {
                title: "Filter by Discover",
                actionLabel: "Set Intent: Discover",
                intent: "DISCOVER",
                subtitle: "Surface serendipitous connections across all orbits",
              },
            ],
          },
        ]);
      } else {
        const matchingSpace =
          spaces.find(
            (s) =>
              s.title?.toLowerCase().includes(p) ||
              s.description?.toLowerCase().includes(p),
          ) || spaces[0];
        const matchingMoment =
          moments.find(
            (m) =>
              m.title?.toLowerCase().includes(p) ||
              m.tags?.some((t) => t && t.toLowerCase().includes(p)),
          ) || moments[0];

        setResponseLog((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            query: promptToSend,
            answer: `Located active human nodes aligning with "${promptToSend}":`,
            recommendations: [
              {
                title: matchingSpace.title,
                actionLabel: "Open Living Space",
                spaceId: matchingSpace.id,
                subtitle: matchingSpace.description,
              },
              {
                title: matchingMoment.title,
                actionLabel: "Inspect Moment",
                momentId: matchingMoment.id,
                subtitle: matchingMoment.description.slice(0, 70) + "...",
              },
            ],
          },
        ]);
      }

      setLoading(false);
    }, 300);
  };

  const handleSelectRecommendation = (rec: RecommendationItem) => {
    // Show brief, intentional destination synchronizing state
    setTransitioningDestination(rec.title);

    setTimeout(() => {
      setTransitioningDestination(null);
      toggleConcierge(false);

      if (rec.spaceId) {
        openSpace(rec.spaceId);
      } else if (rec.momentId) {
        inspectMoment(rec.momentId);
      } else if (rec.intent) {
        setSelectedIntent(rec.intent);
        setCurrentView("orbit");
      } else if (rec.view) {
        setCurrentView(rec.view);
      }
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={() => toggleConcierge(false)}
    >
      <div
        className="w-full sm:max-w-md h-[90vh] sm:h-full rounded-t-3xl sm:rounded-none flex flex-col sm:border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0f22] text-slate-900 dark:text-slate-100 shadow-2xl transition-colors duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle Indicator */}
        <div className="flex sm:hidden w-full items-center justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Destination Transition Overlay */}
        {transitioningDestination && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-[#0b0f22]/95 backdrop-blur-md p-6 text-center animate-in fade-in duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 mb-4 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              Synchronizing Presence...
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Entering{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {transitioningDestination}
              </span>
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 pt-2 sm:pt-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>AI Concierge</span>
                <span className="flex items-center gap-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 px-2 py-0.5 text-[9px] font-mono font-semibold text-purple-600 dark:text-purple-300">
                  ● SYNC
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Contextual navigator · Living Orbit guidance
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleConcierge(false)}
            aria-label="Close Concierge"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 icon-btn focus-ring cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Natural Suggested Inquiries */}
        <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar">
          {[
            "Where is creative energy right now?",
            "Show me a Space about sound design.",
            "Find someone exploring philosophy.",
            "What’s happening in Orbit?",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleQuery(suggestion)}
              className="chip-interactive focus-ring rounded-full bg-slate-100 dark:bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {responseLog.map((log) => (
            <div key={log.id} className="space-y-2.5">
              {log.id !== "init" && (
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-xs bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-3.5 py-2 max-w-[85%] font-medium shadow-xs">
                    {log.query}
                  </div>
                </div>
              )}

              <div className="rounded-2xl rounded-tl-xs border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-3.5 space-y-3">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {log.answer}
                </p>

                {/* Enhanced Contextual Recommendation Cards */}
                {log.recommendations && log.recommendations.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {log.recommendations.map((rec, i) => {
                      const linkedSpace = rec.spaceId
                        ? spaces.find((s) => s.id === rec.spaceId)
                        : null;
                      const linkedMoment = rec.momentId
                        ? moments.find((m) => m.id === rec.momentId)
                        : null;

                      return (
                        <div
                          key={i}
                          onClick={() => handleSelectRecommendation(rec)}
                          className="card-interactive focus-ring group rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-white/[0.03] p-3 text-left font-medium text-slate-800 dark:text-slate-200 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer shadow-xs"
                        >
                          {/* Card Top Metadata */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              {linkedSpace && (
                                <>
                                  <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/30 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                                    {linkedSpace.category}
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    LIVE
                                  </span>
                                </>
                              )}

                              {linkedMoment && (
                                <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                                  {linkedMoment.intent}
                                </span>
                              )}

                              {!linkedSpace && !linkedMoment && (
                                <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.2 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">
                                  NAVIGATE
                                </span>
                              )}
                            </div>

                            {linkedSpace && (
                              <span className="flex items-center gap-1 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                                <Clock className="h-2.5 w-2.5" />
                                {linkedSpace.expiresAt}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                            {rec.title}
                          </h4>

                          {/* Subtitle / Description */}
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {rec.subtitle ||
                              linkedSpace?.description ||
                              "Active social node"}
                          </p>

                          {/* Live Room / Social Presence Metrics */}
                          {linkedSpace && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-slate-100 dark:border-white/5 pt-2 text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
                                <Users className="h-3 w-3" />
                                {linkedSpace.activeParticipants.length}{" "}
                                synchronized
                              </span>

                              {linkedSpace.collectiveGoal && (
                                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                                  <Target className="h-3 w-3" />
                                  {linkedSpace.collectiveGoal.current}/
                                  {linkedSpace.collectiveGoal.target}{" "}
                                  {linkedSpace.collectiveGoal.unit}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action Button Strip */}
                          <div className="mt-2.5 flex items-center justify-between pt-1">
                            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                              {rec.actionLabel}
                            </span>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all">
                              <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 p-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              <span>Attuning to living Orbit nodes...</span>
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
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
          }}
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
            aria-label="Send Inquiry"
            className="btn-press focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
