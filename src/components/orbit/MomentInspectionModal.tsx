import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { EchoType } from '../../types';
import {
  X,
  Clock,
  Users,
  BookmarkPlus,
  Share2,
  ArrowRight,
  Sparkles,
  Heart,
  Anchor,
  Compass,
  Check,
} from 'lucide-react';

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

const ECHOES: { type: EchoType; label: string; icon: string }[] = [
  { type: 'SAME', label: 'Same', icon: '🫂' },
  { type: 'INSPIRED', label: 'Inspired', icon: '⚡' },
  { type: 'CURIOUS', label: 'Curious', icon: '🔮' },
  { type: 'FELT THIS', label: 'Felt This', icon: '💜' },
  { type: 'I CAN HELP', label: 'Can Help', icon: '🛟' },
];

export const MomentInspectionModal: React.FC = () => {
  const {
    inspectingMomentId,
    inspectMoment,
    moments,
    sendEcho,
    recordResonance,
    anchorMoment,
    anchoredMomentIds,
    userResonances,
    serendipityMomentId,
    openSpace,
    saveMemory,
    addToast,
    socialEnergy,
    activeIntentContract,
    currentUser,
    echoLinks,
    selectedIntent,
  } = useNexaStore();

  const [showEchoPicker, setShowEchoPicker] = useState(false);
  const [isHoldingResonance, setIsHoldingResonance] = useState(false);
  const [resonanceCharge, setResonanceCharge] = useState(0);
  const holdIntervalRef = useRef<number | null>(null);

  // Clean up resonance timer on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    };
  }, []);

  if (!inspectingMomentId) return null;

  const moment = moments.find((m) => m.id === inspectingMomentId);
  if (!moment) return null;

  const isAnchored = anchoredMomentIds.includes(moment.id) || moment.lifecycleStatus === 'Anchored';
  const existingUserResonance = userResonances[moment.id];

  // Data-driven transparent matching factors
  const matchingFactors = useMemo(() => {
    if (!moment) return [];
    const factors: { label: string; text: string; isHighlight?: boolean }[] = [];

    // 1. Intent Contract / Active Intent Alignment
    if (activeIntentContract && activeIntentContract.intent === moment.intent) {
      factors.push({
        label: 'Intent Contract',
        text: `Directly aligns with your active contract "${activeIntentContract.label}" (${moment.intent})`,
        isHighlight: true,
      });
    } else if (selectedIntent !== 'ALL' && selectedIntent === moment.intent) {
      factors.push({
        label: 'Intent Filter',
        text: `Surfaced under your explicit intention to ${moment.intent.toLowerCase()}`,
      });
    }

    // 2. Gravitational Proximity & Orbital Ring
    const effectiveDistance =
      activeIntentContract && activeIntentContract.intent === moment.intent
        ? Math.max(1, moment.orbitDistance - 1)
        : moment.orbitDistance;

    if (effectiveDistance === 1) {
      factors.push({
        label: 'Ring 1 (Inner Orbit)',
        text: `Direct communal proximity with ${moment.participantsCount} active ${moment.participantsCount === 1 ? 'person' : 'people'} (${moment.durationLabel} remaining)`,
      });
    } else if (effectiveDistance === 2) {
      factors.push({
        label: 'Ring 2 (Mid Orbit)',
        text: `Harmonic resonance with your frequency and ${moment.participantsCount} participants`,
      });
    } else {
      factors.push({
        label: 'Ring 3 (Outer Horizon)',
        text: `Serendipitous discovery boundary to cross-pollinate outside your usual circles`,
      });
    }

    // 3. Shared Curiosities / Energy Calibration
    const userCuriosities = currentUser?.curiosities || [];
    const matchedCuriosities = userCuriosities.filter((c) =>
      moment.tags.some(
        (t) => t.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(t.toLowerCase())
      )
    );

    if (matchedCuriosities.length > 0) {
      factors.push({
        label: 'Curiosity Overlap',
        text: `Intersects with your saved curiosities in ${matchedCuriosities.slice(0, 2).join(' & ')}`,
      });
    } else {
      factors.push({
        label: 'Energy Calibration',
        text: `${moment.energy} space paired with your current ${socialEnergy} social energy mode (zero algorithmic amplification)`,
      });
    }

    // 4. Social Bridge (Existing EchoLink, lookingFor, or prior resonance)
    const creatorEchoLink = echoLinks?.find(
      (l) => l.targetUserName === moment.creator.name || l.targetUserHandle === moment.creator.handle
    );

    if (creatorEchoLink) {
      factors.push({
        label: 'Echo Link Bridge',
        text: `Hosted by ${moment.creator.name}, with whom you share a ${creatorEchoLink.strength}% resonance`,
        isHighlight: true,
      });
    } else if (existingUserResonance) {
      factors.push({
        label: 'Prior Attunement',
        text: `You previously registered a ${existingUserResonance.intensity} with this moment`,
      });
    } else if (moment.lookingFor && moment.lookingFor.length > 0) {
      factors.push({
        label: 'Looking For',
        text: `Seeking: ${moment.lookingFor.slice(0, 2).join(' & ')}`,
      });
    }

    return factors;
  }, [moment, activeIntentContract, selectedIntent, socialEnergy, currentUser, echoLinks, existingUserResonance]);

  // Press and hold tactile resonance mechanics
  const startResonanceHold = () => {
    setIsHoldingResonance(true);
    setResonanceCharge(5);

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = window.setInterval(() => {
      setResonanceCharge((prev) => {
        if (prev >= 100) {
          stopResonanceHold(100);
          return 100;
        }
        return prev + 6;
      });
    }, 50);
  };

  const stopResonanceHold = (finalChargeOverride?: number) => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    const finalValue = finalChargeOverride ?? resonanceCharge;
    if (finalValue > 15) {
      recordResonance(moment.id, finalValue);
    }
    setIsHoldingResonance(false);
    setResonanceCharge(0);
  };

  const getChargeIntensityLabel = (charge: number) => {
    if (charge >= 85) return 'Transcendent Resonance';
    if (charge >= 60) return 'Deep Resonance';
    if (charge >= 35) return 'Harmonic Resonance';
    return 'Gentle Resonance';
  };

  const handleJoin = () => {
    inspectMoment(null);
    openSpace(moment.spaceId);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Join "${moment.title}" on NEXA: Don't follow people. Follow moments.`
    );
    addToast('Moment link copied to clipboard', 'info');
  };

  const handleSave = () => {
    saveMemory({
      spaceTitle: moment.title,
      summary: moment.description,
      keyArtifacts: [
        { type: 'text', title: 'Activity', content: moment.currentActivity },
      ],
      collaborators: [
        { name: moment.creator.name, avatar: moment.creator.avatar, isGhost: moment.creator.isGhost },
      ],
      tags: moment.tags,
      coordinates: { x: moment.orbitAngle, y: moment.orbitDistance * 30 },
      preservedAt: 'Just now',
    });
    addToast('Preserved to Memory Garden', 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs"
      onClick={() => inspectMoment(null)}
    >
      <div
        className="relative w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#0c1224] p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle indicator */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700 sm:hidden" />

        {/* Serendipity highlight banner if triggered via Surprise Me */}
        {serendipityMomentId === moment.id && (
          <div className="mb-3 flex items-center gap-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs text-cyan-800 dark:text-cyan-200">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
            <span>Serendipity discovery: Pulled outside your usual frequencies</span>
          </div>
        )}

        {/* Top Meta: Category + Lifecycle/Time + Close */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {(() => {
              const badge = getBadgeStyle(moment.intent);
              return (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {moment.intent}
                </span>
              );
            })()}

            {/* Lifecycle Status Pill */}
            {isAnchored ? (
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                <Anchor className="h-3 w-3" />
                <span>Anchored</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>{moment.expiresAt} left</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => inspectMoment(null)}
            className="icon-btn focus-ring rounded-full p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-snug">
          {moment.title}
        </h2>

        {/* Creator Byline */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <img
            src={moment.creator.avatar}
            alt={moment.creator.name}
            className="h-5 w-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
          />
          <span>Created by <strong className="text-slate-900 dark:text-slate-100 font-bold">{moment.creator.name}</strong></span>
        </div>

        {/* Short 1-2 sentence description */}
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {moment.description}
        </p>

        {/* Live presence summary */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3 text-xs border border-slate-200 dark:border-slate-700">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>{moment.participantsCount} people here</span>
          </span>
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px] font-medium">
            {moment.currentActivity}
          </span>
        </div>

        {/* Transparent Human Matching Context: "Why this moment?" */}
        <div className="mt-3 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-cyan-800 dark:text-cyan-300 mb-1.5">
            <Compass className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Why this moment is in your Orbit</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] space-y-1">
            {matchingFactors.map((factor, idx) => (
              <p key={idx} className={factor.isHighlight ? 'text-cyan-800 dark:text-cyan-300 font-semibold' : ''}>
                • <strong>{factor.label}:</strong> {factor.text}
              </p>
            ))}
          </div>
        </div>

        {/* Private User Resonance Status (if user already resonated) */}
        {existingUserResonance && !isHoldingResonance && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-2 text-xs">
            <span className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span>Your Resonance: <strong>{existingUserResonance.intensity}</strong></span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Recorded privately
            </span>
          </div>
        )}

        {/* Press and Hold Tactile Feedback Indicator */}
        {isHoldingResonance && (
          <div className="mt-3 relative overflow-hidden rounded-xl bg-slate-900 p-3 text-center border border-cyan-500/50 shadow-lg shadow-cyan-500/20">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-600/30 to-purple-600/30 transition-all duration-75"
              style={{ width: `${resonanceCharge}%` }}
            />
            <div className="relative z-10 flex items-center justify-between text-xs text-white">
              <span className="font-bold text-cyan-300">
                {getChargeIntensityLabel(resonanceCharge)}
              </span>
              <span className="font-mono text-cyan-400 font-bold">{resonanceCharge}%</span>
            </div>
            <div className="relative z-10 text-[10px] text-slate-300 mt-0.5">
              Hold to deepen resonance... release to forge Echo Link
            </div>
          </div>
        )}

        {/* Quick Echo Reaction Bar (if expanded) */}
        {showEchoPicker && (
          <div className="mt-3 flex items-center justify-around rounded-xl bg-slate-100 dark:bg-white/[0.05] p-2">
            {ECHOES.map((echo) => (
              <button
                key={echo.type}
                onClick={() => {
                  sendEcho(moment.id, echo.type);
                  setShowEchoPicker(false);
                }}
                className="chip-interactive focus-ring flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-xs hover:bg-white dark:hover:bg-white/10 cursor-pointer"
              >
                <span className="text-base">{echo.icon}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400">{echo.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Actions: Primary + Tactile Resonance + Secondary Row */}
        <div className="mt-5 space-y-2">
          {/* Primary Action */}
          <button
            onClick={handleJoin}
            className="btn-press focus-ring flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 py-3 text-sm font-semibold shadow-md cursor-pointer"
          >
            <span>Join Space</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Secondary Actions with Tactile Press-and-Hold Resonance */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between pt-1 gap-1.5">
            {/* Press and Hold Resonance Button */}
            <button
              onMouseDown={startResonanceHold}
              onMouseUp={() => stopResonanceHold()}
              onMouseLeave={() => isHoldingResonance && stopResonanceHold()}
              onTouchStart={startResonanceHold}
              onTouchEnd={() => stopResonanceHold()}
              className={`focus-ring flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all select-none cursor-pointer ${
                isHoldingResonance
                  ? 'bg-cyan-500 text-slate-950 scale-105 shadow-md shadow-cyan-500/30'
                  : 'btn-press text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50'
              }`}
              title="Hold to build tactile resonance"
            >
              <Heart className={`h-3.5 w-3.5 ${isHoldingResonance ? 'animate-ping text-slate-950' : 'text-rose-500'}`} />
              <span>{isHoldingResonance ? 'Holding...' : 'Hold to Resonate'}</span>
            </button>

            {/* Anchor Moment button */}
            <button
              onClick={() => anchorMoment(moment.id)}
              disabled={isAnchored}
              className={`focus-ring flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer ${
                isAnchored
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 cursor-default'
                  : 'btn-press text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Anchor moment to prevent expiration"
            >
              <Anchor className="h-3.5 w-3.5 text-amber-500" />
              <span>{isAnchored ? 'Anchored' : 'Anchor'}</span>
            </button>

            <button
              onClick={handleSave}
              className="btn-press focus-ring flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={handleShare}
              className="btn-press focus-ring flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

