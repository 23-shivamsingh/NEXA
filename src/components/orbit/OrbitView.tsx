import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { OrbitNode } from './OrbitNode';
import { Moment, SocialEnergy } from '../../types';
import { Tooltip } from '../common/Tooltip';
import {
  Radio,
  LayoutGrid,
  RotateCw,
  Plus,
  Users,
  Clock,
  Compass,
  Ghost,
  Sliders,
  Sparkles,
  Shuffle,
  Heart,
  Target,
} from 'lucide-react';

const SOCIAL_ENERGIES: { energy: SocialEnergy; label: string; icon: string; description: string }[] = [
  { energy: 'Quiet', label: 'Quiet', icon: '🌱', description: 'Gentle spacing, slow drift, minimal pressure' },
  { energy: 'Curious', label: 'Curious', icon: '🧭', description: 'Balanced orbit tuned to explore new signals' },
  { energy: 'Social', label: 'Social', icon: '⚡', description: 'Vibrant communal spaces brought front and center' },
  { energy: 'Creative', label: 'Creative', icon: '🎨', description: 'Co-creation spaces and open canvas sessions' },
  { energy: 'Chaotic', label: 'Chaotic', icon: '🔥', description: 'Fast, unexpected, eclectic human moments' },
];

const INTENT_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  CREATE: {
    bg: 'bg-purple-100 dark:bg-purple-950/80',
    text: 'text-purple-900 dark:text-purple-200',
    border: 'border-purple-300 dark:border-purple-500/40',
  },
  CONNECT: {
    bg: 'bg-sky-100 dark:bg-sky-950/80',
    text: 'text-sky-900 dark:text-sky-200',
    border: 'border-sky-300 dark:border-sky-500/40',
  },
  LEARN: {
    bg: 'bg-indigo-100 dark:bg-indigo-950/80',
    text: 'text-indigo-900 dark:text-indigo-200',
    border: 'border-indigo-300 dark:border-indigo-500/40',
  },
  PLAY: {
    bg: 'bg-amber-100 dark:bg-amber-950/80',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-500/40',
  },
  HELP: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/80',
    text: 'text-emerald-900 dark:text-emerald-200',
    border: 'border-emerald-300 dark:border-emerald-500/40',
  },
  DISCOVER: {
    bg: 'bg-cyan-100 dark:bg-cyan-950/80',
    text: 'text-cyan-950 dark:text-cyan-200',
    border: 'border-cyan-300 dark:border-cyan-500/40',
  },
  'JUST VIBE': {
    bg: 'bg-rose-100 dark:bg-rose-950/80',
    text: 'text-rose-900 dark:text-rose-200',
    border: 'border-rose-300 dark:border-rose-500/40',
  },
};

const getBadgeStyle = (intent: string) => {
  return (
    INTENT_BADGES[intent] || {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'border-slate-300 dark:border-slate-700',
    }
  );
};

export const OrbitView: React.FC = () => {
  const {
    moments,
    selectedIntent,
    searchQuery,
    orbitDensity,
    showRadarSweep,
    inspectMoment,
    inspectingMomentId,
    openCreateMoment,
    currentUser,
    isGhostMode,
    socialEnergy,
    setSocialEnergy,
    toggleFrequencies,
    openDrift,
    triggerSurpriseMe,
    toggleSessionMemory,
    presenceMode,
  } = useNexaStore();

  const [hoveredMomentId, setHoveredMomentId] = useState<string | null>(null);
  const [viewStyle, setViewStyle] = useState<'orbit' | 'grid'>('orbit');
  const [orbitAngleOffset, setOrbitAngleOffset] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isEnergyMenuOpen, setIsEnergyMenuOpen] = useState<boolean>(false);

  // Touch drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const initialAngleRef = useRef(0);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute rotation step based on Social Energy
  const rotationStep = useMemo(() => {
    switch (socialEnergy) {
      case 'Quiet':
        return 0.05;
      case 'Curious':
        return 0.09;
      case 'Creative':
        return 0.14;
      case 'Chaotic':
        return 0.26;
      case 'Social':
      default:
        return 0.12;
    }
  }, [socialEnergy]);

  // Slowly rotate orbit nodes smoothly over time when not dragging
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      if (!isDraggingRef.current) {
        setOrbitAngleOffset((prev) => (prev + rotationStep) % 360);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [isRotating, rotationStep]);

  // Touch drag handlers to pan/rotate orbit
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartXRef.current = clientX;
    initialAngleRef.current = orbitAngleOffset;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartXRef.current;
    // Map pixel delta to rotation angle
    const newAngle = (initialAngleRef.current + deltaX * 0.35) % 360;
    setOrbitAngleOffset(newAngle);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Filter moments according to Intent and Search
  const filteredMoments = useMemo(() => {
    const list = moments.filter((m) => {
      if (selectedIntent !== 'ALL' && m.intent !== selectedIntent) {
        return false;
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return Boolean(
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.tags?.some((t) => t && t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Requirement 14: On mobile screen sizes, show only 5-7 high-relevance nodes by default
    return list;
  }, [moments, selectedIntent, searchQuery]);

  const visibleMoments = useMemo(() => {
    if (isMobile) {
      return filteredMoments.slice(0, 6);
    }
    return filteredMoments;
  }, [filteredMoments, isMobile]);

  // Orbit radius scales based on density, screen width, and Social Energy
  const radiusScale = useMemo(() => {
    const base = isMobile ? 0.85 : 1.0;
    let energyFactor = 1.0;
    if (socialEnergy === 'Quiet') energyFactor = 1.15;
    if (socialEnergy === 'Curious') energyFactor = 1.05;
    if (socialEnergy === 'Chaotic') energyFactor = 0.88;

    switch (orbitDensity) {
      case 'compact':
        return base * 0.8 * energyFactor;
      case 'deep_space':
        return base * 1.25 * energyFactor;
      case 'balanced':
      default:
        return base * energyFactor;
    }
  }, [orbitDensity, isMobile, socialEnergy]);

  // Calculate (x, y) percent for each node relative to center (50, 50)
  const nodePositions = useMemo(() => {
    // Rings radiuses in percentages
    const ringRadii: Record<number, number> = {
      1: (isMobile ? 24 : 22) * radiusScale,
      2: (isMobile ? 37 : 36) * radiusScale,
      3: (isMobile ? 45 : 46) * radiusScale,
    };

    const count = visibleMoments.length;
    return visibleMoments.map((moment, index) => {
      // Distribute evenly around their ring so nodes never overlap
      const angleStep = 360 / Math.max(1, count);
      const baseAngle = index * angleStep + (moment.orbitDistance * 25);
      const currentAngle = (baseAngle + orbitAngleOffset) * (Math.PI / 180);
      const r = ringRadii[moment.orbitDistance] || 32 * radiusScale;

      // Keep inside boundary
      const x = 50 + r * Math.cos(currentAngle);
      const y = 50 + r * Math.sin(currentAngle) * (isMobile ? 0.95 : 0.88);

      return {
        moment,
        x: Math.max(isMobile ? 14 : 8, Math.min(isMobile ? 86 : 92, x)),
        y: Math.max(isMobile ? 14 : 10, Math.min(isMobile ? 86 : 90, y)),
      };
    });
  }, [visibleMoments, orbitAngleOffset, radiusScale, isMobile]);

  return (
    <div className="relative min-h-[calc(100vh-7.5rem)] w-full overflow-hidden bg-[var(--bg-app)] transition-colors duration-200">
      {/* Ambient background mesh */}
      <div className="absolute inset-0 bg-space-mesh opacity-80 pointer-events-none" />

      {/* Top Floating Orbit Header */}
      <div className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5 px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] px-3.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 shadow-xs">
            <Radio className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredMoments.length}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {isMobile ? 'nearby' : 'moments in orbit'}
            </span>
          </div>

          {/* Pause / Play auto-spin */}
          <Tooltip content={isRotating ? 'Pause rotation' : 'Resume orbit rotation'}>
            <button
              onClick={() => setIsRotating(!isRotating)}
              aria-label={isRotating ? 'Pause rotation' : 'Resume orbit rotation'}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-all icon-btn focus-ring cursor-pointer ${
                isRotating
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
            </button>
          </Tooltip>
        </div>

        {/* Social Energy Selector */}
        <div className="hidden lg:flex items-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] p-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-500" />
            Energy:
          </span>
          {SOCIAL_ENERGIES.map((se) => {
            const isSelected = socialEnergy === se.energy;
            return (
              <Tooltip key={se.energy} content={se.description}>
                <button
                  onClick={() => setSocialEnergy(se.energy)}
                  className={`chip-interactive focus-ring flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{se.icon}</span>
                  <span>{se.label}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Right Actions: Frequencies, Drift, Surprise, Session Memory & View Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Frequencies Tuning */}
          <button
            onClick={() => toggleFrequencies(true)}
            title="Tune Frequency Weights (Resonance Filter)"
            className="btn-press focus-ring flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-xs cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Frequencies</span>
          </button>

          {/* Drift Mode */}
          <button
            onClick={() => openDrift(true)}
            title="Drift: Wander through serendipitous human signals"
            className="btn-press focus-ring flex items-center gap-1.5 rounded-full border border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-950/60 shadow-xs cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Drift</span>
          </button>

          {/* Surprise Me Button */}
          <button
            onClick={triggerSurpriseMe}
            title="Surprise Me: Discover an unexpected moment outside your dominant habits"
            className="btn-press focus-ring flex items-center gap-1.5 rounded-full border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/60 shadow-xs cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Surprise Me</span>
          </button>

          {/* Session Pulse / Reflection */}
          <button
            onClick={() => toggleSessionMemory(true)}
            title="Session Pulse: Mindful reflection on your non-extractive social journey"
            className="btn-press focus-ring flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 shadow-xs cursor-pointer"
          >
            <Heart className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">Session Pulse</span>
          </button>

          {/* View Switcher: Orbit Canvas vs Grid */}
          <div className="flex items-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] p-1 shadow-xs ml-1">
            <button
              onClick={() => setViewStyle('orbit')}
              title="Spatial Orbit"
              className={`chip-interactive focus-ring flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                viewStyle === 'orbit'
                  ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Orbit</span>
            </button>
            <button
              onClick={() => setViewStyle('grid')}
              title="Grid View"
              className={`chip-interactive focus-ring flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                viewStyle === 'grid'
                  ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orbit Hero Arena */}
      {viewStyle === 'orbit' ? (
        <div
          className="relative mx-auto h-[74vh] sm:h-[78vh] w-full max-w-5xl select-none touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          {/* Concentric Orbital Rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Inner Ring (d=1) */}
            <div
              className="rounded-full border border-cyan-600/20 dark:border-cyan-400/20 transition-all duration-300"
              style={{
                width: `${44 * radiusScale}%`,
                height: `${44 * radiusScale * (isMobile ? 0.95 : 0.88)}%`,
              }}
            />

            {/* Mid Ring (d=2) */}
            <div
              className="absolute rounded-full border border-dashed border-purple-500/20 dark:border-purple-400/20 transition-all duration-300"
              style={{
                width: `${72 * radiusScale}%`,
                height: `${72 * radiusScale * (isMobile ? 0.95 : 0.88)}%`,
              }}
            />

            {/* Outer Ring (d=3) */}
            <div
              className="absolute rounded-full border border-slate-300/60 dark:border-white/5 transition-all duration-300"
              style={{
                width: `${92 * radiusScale}%`,
                height: `${92 * radiusScale * (isMobile ? 0.95 : 0.88)}%`,
              }}
            />

            {/* Subtle Radar Sweep */}
            {showRadarSweep && (
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                style={{
                  width: `${92 * radiusScale}%`,
                  height: `${92 * radiusScale * (isMobile ? 0.95 : 0.88)}%`,
                  margin: 'auto',
                }}
              >
                <div className="h-full w-full animate-spin-slow origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,rgba(6,182,212,0.08)_360deg)]" />
              </div>
            )}
          </div>

          {/* Center: YOU Node (Visually Anchored & Distinctive with Social Aura) */}
          <div
            role="button"
            tabIndex={0}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-center group touch-manipulation focus-ring rounded-full"
            onClick={() => openCreateMoment(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCreateMoment(true);
              }
            }}
            title={`You are at the center of NEXA Orbit (${socialEnergy} Energy, ${presenceMode} Mode) — Tap to launch a moment`}
            aria-label={`Launch moment. You are at the center of NEXA Orbit, ${socialEnergy} Energy, ${presenceMode} Mode`}
          >
            <div className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 bg-white dark:bg-[#0b1026] shadow-lg transition-all duration-200 group-hover:scale-105 active:scale-95 ${
              socialEnergy === 'Quiet'
                ? 'border-emerald-500 shadow-emerald-500/25'
                : socialEnergy === 'Curious'
                ? 'border-cyan-500 shadow-cyan-500/25'
                : socialEnergy === 'Creative'
                ? 'border-purple-500 shadow-purple-500/25'
                : socialEnergy === 'Chaotic'
                ? 'border-rose-500 shadow-rose-500/25'
                : 'border-amber-500 shadow-amber-500/25'
            }`}>
              {/* Dynamic Aura Ring */}
              <div
                className={`absolute -inset-2 rounded-full border animate-pulse pointer-events-none ${
                  socialEnergy === 'Quiet'
                    ? 'border-emerald-400/40 bg-emerald-500/5'
                    : socialEnergy === 'Curious'
                    ? 'border-cyan-400/40 bg-cyan-500/5'
                    : socialEnergy === 'Creative'
                    ? 'border-purple-400/40 bg-purple-500/5'
                    : socialEnergy === 'Chaotic'
                    ? 'border-rose-400/40 bg-rose-500/5'
                    : 'border-amber-400/40 bg-amber-500/5'
                }`}
              />
              {isGhostMode ? (
                <Ghost className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600 dark:text-cyan-300" />
              ) : (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-11 w-11 sm:h-13 sm:w-13 rounded-full object-cover"
                />
              )}
            </div>
            <div className="mt-1.5 flex flex-col items-center gap-0.5">
              <span className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-xs">
                {isGhostMode ? 'GHOST' : 'YOU'}
              </span>
              <span className="text-[9px] font-semibold text-cyan-700 dark:text-cyan-400">
                {presenceMode}
              </span>
            </div>
          </div>

          {/* Orbit Moment Nodes */}
          {nodePositions.map(({ moment, x, y }) => (
            <OrbitNode
              key={moment.id}
              moment={moment}
              x={x}
              y={y}
              isHovered={hoveredMomentId === moment.id}
              onHover={setHoveredMomentId}
              onClick={(m) => inspectMoment(m.id)}
            />
          ))}

          {/* Clean Empty State */}
          {filteredMoments.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#090d1c]/90 p-6 backdrop-blur-xl max-w-sm shadow-xl">
                <Compass className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Moments Here Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Be the first to launch an ephemeral moment into this orbit.
                </p>
                <button
                  onClick={() => openCreateMoment(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Launch Moment</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Explore More Button */}
          {isMobile && filteredMoments.length > visibleMoments.length && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
              <button
                id="mobile-explore-more-btn"
                onClick={() => setViewStyle('grid')}
                className="flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-white/95 dark:bg-[#070c1d]/95 px-3.5 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-md transition-all active:scale-95"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Explore more ({filteredMoments.length - visibleMoments.length}+)</span>
              </button>
            </div>
          )}

          {/* Subtle Mobile Drag Hint */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 dark:text-slate-500 font-medium pointer-events-none sm:hidden">
            Drag to rotate orbit
          </div>
        </div>
      ) : (
        /* High-Contrast, WCAG-Compliant Production Grid View */
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {filteredMoments.length === 0 ? (
            <div className="rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1224] p-12 text-center shadow-xs">
              <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                No moments currently found matching your filter.
              </p>
              <button
                onClick={() => openCreateMoment(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-bold px-4 py-2 text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create a new Moment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredMoments.map((moment) => {
                const badge = getBadgeStyle(moment.intent);
                const isSelected = inspectingMomentId === moment.id;

                return (
                  <div
                    key={moment.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => inspectMoment(moment.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        inspectMoment(moment.id);
                      }
                    }}
                    className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-5 sm:p-5.5 card-interactive focus-ring transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan-500 ring-2 ring-cyan-500 bg-cyan-50/50 dark:border-cyan-400 dark:ring-cyan-400 dark:bg-slate-900 shadow-md'
                        : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-md dark:hover:shadow-cyan-950/40 shadow-xs'
                    }`}
                  >
                    <div className="min-w-0">
                      {/* 1. Category + Timer */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {moment.intent}
                        </span>

                        <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shrink-0">
                          <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                          <span>{moment.expiresAt}</span>
                        </span>
                      </div>

                      {/* 2. Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug break-words group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                        {moment.title}
                      </h3>

                      {/* 3. Short Description */}
                      <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed break-words">
                        {moment.description}
                      </p>
                    </div>

                    {/* Footer: 4. Participant count & 5. Primary Join action */}
                    <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>{moment.participantsCount} here</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectMoment(moment.id);
                        }}
                        className="btn-press focus-ring inline-flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold px-4 py-1.5 text-xs shadow-xs cursor-pointer"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
