import React from 'react';
import { Moment } from '../../types';
import { useNexaStore } from '../../store/useNexaStore';
import {
  Radio,
  Music,
  Sparkles,
  Zap,
  Coffee,
  Code,
  Moon,
  Compass,
  Palette,
  Gamepad2,
  Users,
  Anchor,
} from 'lucide-react';

interface OrbitNodeProps {
  moment: Moment;
  x: number;
  y: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (moment: Moment) => void;
  scale?: number;
}

// Short human-curated title helper (1-3 words max as requested)
function getShortTitle(m: Moment): string {
  const tl = m.title?.toLowerCase() || '';
  if (tl.includes('radio')) return 'Radio Lab';
  if (tl.includes('meteor')) return 'Meteor Watch';
  if (tl.includes('co-working') || tl.includes('lo-fi')) return 'Silent Focus';
  if (tl.includes('game')) return 'Game Jam';
  if (tl.includes('philosophy')) return 'Midnight Talks';
  if (tl.includes('soundscape') || tl.includes('ambient')) return 'Ambient Audio';
  if (tl.includes('manga') || tl.includes('cyberpunk')) return 'Cyberpunk';
  if (tl.includes('tokyo') || tl.includes('architecture')) return 'Tokyo Walk';
  if (tl.includes('rust') || tl.includes('tea')) return 'Rust & Tea';
  if (tl.includes('synth')) return 'Synth Workshop';
  // Fallback: take first 2-3 words
  const words = (m.title || 'Moment').split(' ').slice(0, 2).join(' ');
  return words.length > 16 ? words.slice(0, 14) + '…' : words;
}

// Appropriate minimalist category icon
function getNodeIcon(m: Moment) {
  const t = (m.title?.toLowerCase() || '') + ' ' + (m.tags || []).join(' ').toLowerCase();
  if (t.includes('music') || t.includes('synth') || t.includes('audio')) return Music;
  if (t.includes('radio')) return Radio;
  if (t.includes('meteor') || t.includes('space') || t.includes('stargazing')) return Sparkles;
  if (t.includes('code') || t.includes('rust') || t.includes('hacker')) return Code;
  if (t.includes('coffee') || t.includes('tea') || t.includes('focus')) return Coffee;
  if (t.includes('philosophy') || t.includes('talk')) return Moon;
  if (t.includes('art') || t.includes('design')) return Palette;
  if (t.includes('game') || t.includes('jam')) return Gamepad2;
  return Zap;
}

export const OrbitNode: React.FC<OrbitNodeProps> = ({
  moment,
  x,
  y,
  isHovered,
  onHover,
  onClick,
  scale = 1,
}) => {
  const { anchoredMomentIds, userResonances } = useNexaStore();
  const IconComponent = getNodeIcon(moment);
  const shortTitle = getShortTitle(moment);
  const isAnchored = anchoredMomentIds.includes(moment.id) || moment.lifecycleStatus === 'Anchored';
  const hasResonated = !!userResonances[moment.id];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(moment);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.08 : scale})`,
        zIndex: isHovered ? 30 : 10,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={() => onHover(moment.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(moment)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer select-none group touch-manipulation focus:outline-none"
      aria-label={`${moment.title}, ${moment.participantsCount} participants${isAnchored ? ', Anchored' : ''}`}
      title={`${moment.title} (${moment.participantsCount} here)${isAnchored ? ' • Anchored' : ''}${hasResonated ? ' • You resonated' : ''}`}
    >
      {/* Compact Spatial Node Object */}
      <div
        className={`relative flex items-center gap-2 rounded-2xl py-1.5 px-3 border transition-all duration-200 min-h-[44px] focus-ring active:scale-95 ${
          isHovered
            ? 'shadow-md scale-105'
            : 'shadow-xs hover:border-cyan-500/50'
        } bg-white dark:bg-[#0b0f22] ${isAnchored ? 'border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/30' : 'border-slate-200 dark:border-white/15'}`}
        style={{
          boxShadow: isHovered
            ? `0 6px 20px -2px ${moment.accentColor}40`
            : undefined,
        }}
      >
        {/* Subtle breathing aura */}
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-20 dark:opacity-30 animate-pulse pointer-events-none"
          style={{ backgroundColor: moment.accentColor }}
        />

        {/* Node Icon */}
        <div
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
          style={{ backgroundColor: moment.accentColor }}
        >
          <IconComponent className="h-3.5 w-3.5 stroke-[2.2]" />

          {/* Anchored Pin Indicator */}
          {isAnchored && (
            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] text-white shadow-xs font-bold">
              ⚓
            </div>
          )}

          {/* User Resonance Star */}
          {hasResonated && !isAnchored && (
            <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 text-[8px] text-white shadow-xs">
              ✦
            </div>
          )}
        </div>

        {/* Short Text Stack: Short Name + Live Count */}
        <div className="flex flex-col text-left pr-0.5">
          <span className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-1">
            <span>{shortTitle}</span>
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-0.5 whitespace-nowrap">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full mr-0.5 animate-ping"
              style={{ backgroundColor: moment.accentColor }}
            />
            {moment.participantsCount} here
          </span>
        </div>
      </div>
    </div>
  );
};
