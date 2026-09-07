import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Sparkles,
  Ghost,
  Radio,
  BookmarkPlus,
  Clock,
  Compass,
  Zap,
  Users,
  Link2,
  Activity,
  Layers,
  Shield,
  Eye,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const IdentityMapView: React.FC = () => {
  const {
    currentUser,
    isGhostMode,
    toggleGhostMode,
    presenceMode,
    setPresenceMode,
    moments,
    memories,
    inspectMoment,
    echoLinks,
    userResonances,
    setCurrentView,
    frequencies,
    toggleFrequencies,
  } = useNexaStore();

  const [activeAuraTab, setActiveAuraTab] = useState<'archetypes' | 'harmonics'>('archetypes');

  // Filter moments created by the current user
  const userMoments = moments.filter(
    (m) =>
      (m.creator?.name?.toLowerCase() || '') === (currentUser?.name?.toLowerCase() || '') ||
      m.creator?.isGhost
  );

  const intentDist = currentUser.intentDistribution || [
    { intent: 'CREATE', percentage: 40 },
    { intent: 'JUST VIBE', percentage: 25 },
    { intent: 'CONNECT', percentage: 20 },
    { intent: 'LEARN', percentage: 15 },
  ];

  const userCuriosities = currentUser.curiosities || [
    'Generative Audio',
    'Spatial Computing',
    'Midnight Philosophy',
    'Street Photography',
    'Indie Protocols',
  ];

  // Living identity archetypes derived from signature or defaults
  const signature = currentUser.signature || {
    creator: 42,
    explorer: 35,
    connector: 28,
    builder: 38,
    learner: 24,
  };

  const resonanceCount = Object.keys(userResonances || {}).length || 7;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-3.5 py-5 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8 pb-28 transition-colors duration-200">
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
        
        {/* ========================================================
            1. PROFILE HEADER
            ======================================================== */}
        <section
          id="identity-profile-header"
          className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-4 sm:p-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                {isGhostMode ? (
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40">
                    <Ghost className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse" />
                  </div>
                ) : (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-slate-300 dark:border-slate-700"
                  />
                )}
                <div
                  className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-[#0c1224] bg-emerald-500"
                  title="Present in Orbit"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-50 truncate">
                    {isGhostMode ? 'Ghost Identity' : currentUser.name}
                  </h1>
                  <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 px-2.5 py-0.5 text-[11px] font-bold text-cyan-900 dark:text-cyan-200 shrink-0">
                    {currentUser.handle || '@kiran.nexa'}
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                  {currentUser.bio || currentUser.statement || 'Exploring human-scale serendipity in spatial orbits.'}
                </p>
              </div>
            </div>

            {/* Ghost Mode Toggle */}
            <div className="w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={toggleGhostMode}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer min-h-[42px] ${
                  isGhostMode
                    ? 'border-cyan-500 bg-cyan-100 dark:bg-cyan-950 text-cyan-950 dark:text-cyan-200 shadow-xs'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`}
              >
                <Ghost className="h-4 w-4 shrink-0" />
                <span>{isGhostMode ? 'Ghost Mode Active' : 'Switch to Ghost Mode'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              2. CURRENT CURIOSITIES
              ======================================================== */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Current Curiosities</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Signals tuning your orbit
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userCuriosities.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 transition-colors"
                >
                  #{item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. AURA — SIGNATURE LIVING IDENTITY VISUAL
            ======================================================== */}
        <section
          id="identity-aura-card"
          className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/40 via-white to-cyan-50/40 dark:from-[#0f0e26] dark:via-[#0c1224] dark:to-[#081726] p-4 sm:p-6 shadow-xs relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-0.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Living Identity Field</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                Your Resonance Aura
              </h2>
            </div>

            {/* Aura Tabs */}
            <div
              role="tablist"
              aria-label="Resonance Aura modes"
              className="flex items-center gap-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 p-1 self-start sm:self-auto"
            >
              <button
                type="button"
                id="aura-tab-archetypes"
                role="tab"
                aria-selected={activeAuraTab === 'archetypes'}
                aria-controls="aura-panel-archetypes"
                onClick={() => setActiveAuraTab('archetypes')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 ${
                  activeAuraTab === 'archetypes'
                    ? 'bg-white dark:bg-[#0c1224] text-purple-600 dark:text-purple-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Archetypes
              </button>
              <button
                type="button"
                id="aura-tab-harmonics"
                role="tab"
                aria-selected={activeAuraTab === 'harmonics'}
                aria-controls="aura-panel-harmonics"
                onClick={() => setActiveAuraTab('harmonics')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 ${
                  activeAuraTab === 'harmonics'
                    ? 'bg-white dark:bg-[#0c1224] text-cyan-600 dark:text-cyan-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Harmonics
              </button>
            </div>
          </div>

          {/* Aura Interactive Graphic + Archetype / Harmonics Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center relative z-10">
            {/* SVG Visual Aura Sphere */}
            <div className="sm:col-span-5 flex items-center justify-center py-2">
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 flex items-center justify-center">
                {/* SVG Concentric Aura Rings */}
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="auraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="auraGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="auraGradHarmonic1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="auraGradHarmonic2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>

                  {/* Outer Orbit Track */}
                  <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-200 dark:text-slate-800/80" />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke={activeAuraTab === 'harmonics' ? 'url(#auraGradHarmonic1)' : 'url(#auraGrad1)'}
                    strokeWidth="3.5"
                    strokeDasharray="552"
                    strokeDashoffset={activeAuraTab === 'harmonics' ? '90' : '140'}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />

                  {/* Mid Track */}
                  <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-200 dark:text-slate-800/80" />
                  <circle
                    cx="100"
                    cy="100"
                    r="66"
                    fill="none"
                    stroke={activeAuraTab === 'harmonics' ? 'url(#auraGradHarmonic2)' : 'url(#auraGrad2)'}
                    strokeWidth="3.5"
                    strokeDasharray="414"
                    strokeDashoffset={activeAuraTab === 'harmonics' ? '110' : '120'}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />

                  {/* Inner Track */}
                  <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-200 dark:text-slate-800/80" />
                  <circle
                    cx="100"
                    cy="100"
                    r="44"
                    fill="none"
                    stroke={activeAuraTab === 'harmonics' ? '#38bdf8' : '#06b6d4'}
                    strokeWidth="3"
                    strokeDasharray="276"
                    strokeDashoffset={activeAuraTab === 'harmonics' ? '55' : '70'}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Central Core Indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">
                    YOUR AURA
                  </span>
                  <span className="text-[10px] font-mono font-medium text-cyan-600 dark:text-cyan-400 mt-0.5 tracking-wider uppercase transition-opacity duration-300">
                    {activeAuraTab === 'harmonics' ? 'Harmonic Field' : 'Archetype Core'}
                  </span>
                </div>
              </div>
            </div>

            {/* Archetypes vs Harmonics Panel */}
            {activeAuraTab === 'archetypes' ? (
              <div
                id="aura-panel-archetypes"
                role="tabpanel"
                aria-labelledby="aura-tab-archetypes"
                className="sm:col-span-7 space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                      <span>✦ Creator</span>
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{signature.creator}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${signature.creator}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                      <span>🧭 Explorer</span>
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{signature.explorer}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${signature.explorer}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                      <span>🔗 Connector</span>
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{signature.connector}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${signature.connector}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <span>⚡ Builder</span>
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{signature.builder}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${signature.builder}%` }} />
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                  Your Aura organically deepens as you resonate with moments, forge Echo Links, and contribute to Living Spaces.
                </p>
              </div>
            ) : (
              <div
                id="aura-panel-harmonics"
                role="tabpanel"
                aria-labelledby="aura-tab-harmonics"
                className="sm:col-span-7 space-y-3"
              >
                {(frequencies || []).slice(0, 4).map((freq) => (
                  <div key={freq.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                        <Radio className="h-3 w-3 shrink-0 text-cyan-600 dark:text-cyan-400" />
                        <span className="truncate max-w-[200px] sm:max-w-[260px]">{freq.label}</span>
                      </span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{freq.strength}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${freq.strength}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>Active Resonances: <strong className="font-mono text-slate-800 dark:text-slate-200">{resonanceCount}</strong></span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFrequencies(true)}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Open Frequencies tuning"
                  >
                    <span>Tune Harmonics</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            4. IDENTITY SIGNALS & INTENT DISTRIBUTION
            ======================================================== */}
        <section
          id="identity-signals-card"
          className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-4 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Identity Signals</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Real social momentum
            </span>
          </div>

          {/* Vital Signals Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
            <div className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                Spaces Joined
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 truncate block">
                {currentUser.spacesJoinedCount || 5}
              </span>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                Moments Launched
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 truncate block">
                {userMoments.length}
              </span>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                Echo Links
              </span>
              <span className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan-400 truncate block">
                {echoLinks.length}
              </span>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                Resonances
              </span>
              <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 truncate block">
                {resonanceCount}
              </span>
            </div>
          </div>

          {/* Intent Breakdown */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2.5">
              Intent Distribution
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {intentDist.map((dist) => (
                <div
                  key={dist.intent}
                  className="min-w-0 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs"
                >
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block truncate">
                    {dist.intent}
                  </span>
                  <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                    {dist.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. ACTIVE MOMENTS IN ORBIT
            ======================================================== */}
        <section
          id="identity-active-moments"
          className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-4 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Your Active Moments ({userMoments.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => setCurrentView('orbit')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View in Orbit</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userMoments.map((m) => (
              <div
                key={m.id}
                onClick={() => inspectMoment(m.id)}
                className="cursor-pointer rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3.5 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">{m.intent}</span>
                  <span className="flex items-center gap-1 font-mono font-medium text-slate-700 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {m.expiresAt}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-50 truncate">
                  {m.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                  {m.description}
                </p>
              </div>
            ))}

            {userMoments.length === 0 && (
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 py-3 col-span-full">
                No active moments launched currently. Launch one from the Orbit!
              </p>
            )}
          </div>
        </section>

        {/* ========================================================
            6. ECHO LINKS — MUTUAL RESONANCE CONNECTIONS
            ======================================================== */}
        <section
          id="identity-echo-links"
          className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-4 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Echo Links ({echoLinks.length})</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Formed automatically through sustained resonance and mutual curiosity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('matches')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Explore People</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {echoLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 p-3.5 transition-all hover:border-purple-500/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={link.targetUserAvatar}
                    alt={link.targetUserName}
                    className="h-10 w-10 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                      {link.targetUserName}
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 block truncate">
                      {link.resonanceType || 'Harmonic Resonance'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                    {link.strength}%
                  </span>
                  <div className="h-1.5 w-14 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${link.strength}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {echoLinks.length === 0 && (
              <div className="col-span-full py-3 text-center text-xs text-slate-600 dark:text-slate-400">
                <span>No Echo Links forged yet. Resonate with moments in the Orbit to establish links!</span>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            7. MEMORIES / ACTIVITY
            ======================================================== */}
        <section
          id="identity-memories-garden"
          className="rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-4 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <BookmarkPlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Preserved in Garden ({memories.length})</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Artifacts, highlights, and insights crystallized from expired spaces.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('memories')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Visit Garden</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {memories.slice(0, 4).map((memory) => (
              <div
                key={memory.id}
                onClick={() => setCurrentView('memories')}
                className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 p-3.5 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                    {memory.preservedAt || 'Crystallized'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {memory.collaborators?.length || 3} minds
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                  {memory.spaceTitle || memory.momentTitle}
                </h4>
                {memory.highlightedTakeaway && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                    "{memory.highlightedTakeaway}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
