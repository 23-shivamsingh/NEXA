import React from 'react';
import {
  Radio,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Compass,
  Ghost,
  Repeat,
  Flame,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import { useNexaStore } from '../../store/useNexaStore';

export const LandingView: React.FC = () => {
  const { setCurrentView, setSelectedIntent } = useNexaStore();

  const handleEnter = (intent: any = 'ALL') => {
    setSelectedIntent(intent);
    setCurrentView('orbit');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-app)] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 transition-colors duration-200">
      {/* Background Starlight & Ambient Grid */}
      <div className="pointer-events-none absolute inset-0 bg-space-mesh opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-space-grid opacity-30" />

      {/* Hero Section */}
      <section className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 pt-16 text-center sm:px-6 lg:px-8">
        {/* Animated Concentric Orbital Rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35">
          <div className="h-[280px] w-[280px] rounded-full border border-cyan-500/20 md:h-[420px] md:w-[420px]" />
          <div className="absolute h-[460px] w-[460px] rounded-full border border-purple-500/20 border-dashed animate-orbit-slow md:h-[680px] md:w-[680px]" />
          <div className="absolute h-[640px] w-[640px] rounded-full border border-blue-500/10 md:h-[940px] md:w-[940px]" />
        </div>

        {/* Tagline Pill */}
        <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>HACKATHON CHALLENGE: REIMAGINE SOCIAL</span>
        </div>

        {/* Hero Display Headline */}
        <h1 className="relative z-10 font-display text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-8xl leading-[0.95]">
          <span className="block text-slate-400 dark:text-slate-500">Social</span>
          <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-sky-200 dark:to-purple-400 bg-clip-text text-transparent">
            Without
          </span>
          <span className="block text-slate-900 dark:text-white">The Feed.</span>
        </h1>

        {/* Subheadline */}
        <p className="relative z-10 mt-8 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-relaxed">
          NEXA is an intent-driven social environment built around moments, living spaces, and collective creation —{' '}
          <span className="font-semibold text-slate-900 dark:text-white">not followers, likes, or algorithmic doomscrolling</span>.
        </p>

        {/* Core Tagline Highlight */}
        <div className="relative z-10 mt-3 text-xs tracking-widest uppercase font-bold text-cyan-600 dark:text-cyan-400/90">
          “Don’t follow people. Follow moments.”
        </div>

        {/* CTAs */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            id="landing-cta-enter"
            onClick={() => handleEnter('ALL')}
            className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-8 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Radio className="h-4 w-4 text-white animate-pulse" />
            <span>ENTER NEXA ORBIT</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#comparison"
            className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.03] px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-white/30 hover:bg-white dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white shadow-xs"
          >
            <span>Explore The Paradigm</span>
          </a>
        </div>

        {/* Intent Quick Launchers */}
        <div className="relative z-10 mt-14 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 mr-2 text-[11px] font-semibold tracking-wider uppercase">Or enter with intent:</span>
          {(['CREATE', 'CONNECT', 'LEARN', 'JUST VIBE'] as const).map((intent) => (
            <button
              key={intent}
              onClick={() => handleEnter(intent)}
              className="rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-white"
            >
              {intent}
            </button>
          ))}
        </div>
      </section>

      {/* The Core Paradigm Comparison Section */}
      <section id="comparison" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">The Structural Inversion</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            A Clean Break From Feeds
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Traditional social media traps your consciousness in passive consumption loops. NEXA anchors social connection into intentional participation.
          </p>
        </div>

        {/* Flow Contrast Matrix */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Traditional Social */}
          <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-50/50 via-white to-red-50/20 dark:from-red-950/15 dark:via-[#0a0710]/40 dark:to-[#05070f] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
              <span className="font-display text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Traditional Social Loop
              </span>
              <span className="text-xs text-red-500/80 dark:text-red-400/70 font-mono">Status Quo</span>
            </div>

            <div className="mt-6 space-y-4 font-mono text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">1</span>
                <span>User broadcasts static post to farm followers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">2</span>
                <span>Algorithmic feed maximizes outrage & watch time</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">3</span>
                <span>Binary "Like" button aggregates vanity metrics</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400">4</span>
                <span>Endless vertical doomscroll leaves user exhausted</span>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-red-500/15 bg-red-100/50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-300 font-sans">
              <strong>Outcome:</strong> Passive voyeurism, loneliness, follower anxiety, and attention hijacking.
            </div>
          </div>

          {/* NEXA Model */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-50/50 via-white to-cyan-50/20 dark:from-cyan-950/20 dark:via-[#061326]/50 dark:to-[#05070f] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
              <span className="font-display text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                The NEXA Dynamic System
              </span>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">Future Standard</span>
            </div>

            <div className="mt-6 space-y-4 font-mono text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300">1</span>
                <span><strong className="text-cyan-700 dark:text-cyan-300 font-semibold">Intent:</strong> User chooses what they want to experience</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300">2</span>
                <span><strong className="text-cyan-700 dark:text-cyan-300 font-semibold">Orbit Moment:</strong> Social moments orbit user based on proximity</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300">3</span>
                <span><strong className="text-cyan-700 dark:text-cyan-300 font-semibold">Living Space:</strong> Enter temporary room to co-create & vibe</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300">4</span>
                <span><strong className="text-cyan-700 dark:text-cyan-300 font-semibold">Echo & Garden:</strong> Meaningful resonance preserved in memory</span>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-cyan-500/20 bg-cyan-100/50 dark:bg-cyan-950/40 p-3 text-xs text-cyan-800 dark:text-cyan-200 font-sans">
              <strong>Outcome:</strong> Genuine collaboration, zero follower pressure, creative output, and deep presence.
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Innovations Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">System Architecture</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Nine Pillars of Un-Social Media
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'The Orbit Discovery',
              desc: 'Moments float as gravitational nodes around you. Proximity represents real-time relevance, not algorithm manipulation.',
              icon: Radio,
              color: 'text-cyan-600 dark:text-cyan-400',
              border: 'border-cyan-200 dark:border-cyan-500/20',
            },
            {
              title: 'Living Spaces',
              desc: 'Temporary ephemeral rooms for synchronized audio, live ideation, canvas notes, and sprint focus.',
              icon: Users,
              color: 'text-purple-600 dark:text-purple-400',
              border: 'border-purple-200 dark:border-purple-500/20',
            },
            {
              title: 'The Echo Resonance',
              desc: 'No like buttons. Send meaningful social intentions: SAME, FELT THIS, CURIOUS, I CAN HELP, or INSPIRED.',
              icon: Zap,
              color: 'text-rose-600 dark:text-rose-400',
              border: 'border-rose-200 dark:border-rose-500/20',
            },
            {
              title: 'Ghost Mode',
              desc: 'Enter sensitive or exploratory spaces completely anonymously. Free yourself from personal branding pressure.',
              icon: Ghost,
              color: 'text-sky-600 dark:text-sky-400',
              border: 'border-sky-200 dark:border-sky-500/20',
            },
            {
              title: 'The Remix Engine',
              desc: 'Transform thoughts into playlists, photos into poems, and questions into community challenges with lineage.',
              icon: Repeat,
              color: 'text-emerald-600 dark:text-emerald-400',
              border: 'border-emerald-200 dark:border-emerald-500/20',
            },
            {
              title: 'Memory Garden',
              desc: 'When spaces end, preserve the shared creation into an eternal glowing constellation rather than letting it vanish.',
              icon: Sparkles,
              color: 'text-amber-600 dark:text-amber-400',
              border: 'border-amber-200 dark:border-amber-500/20',
            },
            {
              title: 'Social Quests',
              desc: 'Meaningful micro-missions that encourage connecting outside your bubble and co-creating with strangers.',
              icon: Compass,
              color: 'text-indigo-600 dark:text-indigo-400',
              border: 'border-indigo-200 dark:border-indigo-500/20',
            },
            {
              title: 'Identity Maps',
              desc: 'No follower counts. A visual constellation representing your creative signatures, passions, and collaborations.',
              icon: Layers,
              color: 'text-fuchsia-600 dark:text-fuchsia-400',
              border: 'border-fuchsia-200 dark:border-fuchsia-500/20',
            },
            {
              title: 'AI Social Concierge',
              desc: 'Powered by server-side Gemini to synthesize brainstorms, generate thoughtful icebreakers, and recommend spaces.',
              icon: Cpu,
              color: 'text-cyan-600 dark:text-cyan-300',
              border: 'border-cyan-200 dark:border-cyan-500/20',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl border ${item.border} bg-white/80 dark:bg-[#070b16]/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/20 shadow-xs`}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.04]">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Launch Banner */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/40 p-8 sm:p-14 shadow-2xl backdrop-blur-xl">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-5xl">
            Step Into The Orbit
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
            Real people are collaborating right now on generative radio, Perseid stargazing, and indie tools.
          </p>
          <div className="mt-8">
            <button
              onClick={() => handleEnter('ALL')}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]"
            >
              <span>Launch NEXA Experience</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
