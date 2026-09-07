import React, { useState } from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import { PresenceMode } from '../../types';
import {
  ArrowLeft,
  Clock,
  Zap,
  Users,
  Ghost,
  Sparkles,
  BookmarkPlus,
  Send,
  Plus,
  ThumbsUp,
  Music,
  Lightbulb,
  Radio,
  Volume2,
  Headphones,
  Mic,
  PenTool,
  Eye,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const PRESENCE_MODES: { mode: PresenceMode; label: string; icon: React.ElementType; desc: string }[] = [
  { mode: 'LISTEN', label: 'Listen', icon: Headphones, desc: 'Tuned into sound and ambient stream' },
  { mode: 'TALK', label: 'Talk', icon: Mic, desc: 'Active voice & chat participation' },
  { mode: 'CREATE', label: 'Create', icon: PenTool, desc: 'Synthesizing ideas and canvas artifacts' },
  { mode: 'OBSERVE', label: 'Observe', icon: Eye, desc: 'Quiet presence in the periphery' },
];

export const LivingSpaceDetail: React.FC = () => {
  const {
    activeSpaceId,
    spaces,
    leaveSpace,
    addIdeaToSpace,
    voteIdea,
    addMessageToSpace,
    votePoll,
    addSongToPlaylist,
    upvoteSong,
    addCanvasNote,
    saveMemory,
    isGhostMode,
    toggleGhostMode,
    addToast,
    presenceMode,
    setPresenceMode,
    contributeToCollectiveGoal,
  } = useNexaStore();

  const [activeTab, setActiveTab] = useState<'canvas' | 'ideas' | 'audio' | 'stream'>('canvas');
  const [showLiveTicker, setShowLiveTicker] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaCategory, setNewIdeaCategory] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showPreserveModal, setShowPreserveModal] = useState(false);
  const [preserveSummary, setPreserveSummary] = useState('');

  // Canvas note creation state
  const [noteText, setNoteText] = useState('');
  const [noteColor, setNoteColor] = useState('#06b6d4');
  const [isDroppingNote, setIsDroppingNote] = useState(false);

  const space = spaces.find((s) => s.id === activeSpaceId);

  if (!space) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 bg-[var(--bg-app)] text-slate-900 dark:text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-4">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold">Living Space Not Found or Expired</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          This temporary living space has concluded its duration or dissolved back into the Orbit constellation.
        </p>
        <button
          onClick={leaveSpace}
          className="btn-press focus-ring mt-6 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold px-6 py-2.5 text-xs shadow-md transition-all cursor-pointer"
        >
          Return to Orbit
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addMessageToSpace(space.id, chatInput.trim());
    setChatInput('');
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;
    addIdeaToSpace(space.id, newIdeaTitle.trim(), newIdeaCategory.trim() || undefined);
    setNewIdeaTitle('');
    setNewIdeaCategory('');
    addToast('Idea added to collaborative wall', 'aura');
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;
    addSongToPlaylist(space.id, songTitle.trim(), songArtist.trim() || 'Community Member');
    setSongTitle('');
    setSongArtist('');
    setShowAddSong(false);
    addToast('Track suggested to room stream', 'info');
  };

  const handleDropCanvasNote = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    if (noteText.trim()) {
      addCanvasNote(space.id, {
        text: noteText.trim(),
        color: noteColor,
        x: Math.max(8, Math.min(88, x)),
        y: Math.max(10, Math.min(88, y)),
      });
      setNoteText('');
      setIsDroppingNote(false);
      addToast('Thought placed on canvas', 'aura');
    } else {
      addToast('Type your thought in the contribution bar first', 'info');
    }
  };

  const handleQuickAddCanvasNote = () => {
    if (!noteText.trim()) {
      addToast('Type your thought first before placing', 'info');
      return;
    }
    // Place at a random center position if clicked directly
    const x = 30 + Math.floor(Math.random() * 40);
    const y = 30 + Math.floor(Math.random() * 40);
    addCanvasNote(space.id, {
      text: noteText.trim(),
      color: noteColor,
      x,
      y,
    });
    setNoteText('');
    setIsDroppingNote(false);
    addToast('Thought placed on canvas', 'aura');
  };

  const handleConfirmPreserve = () => {
    saveMemory({
      spaceTitle: space.title,
      summary:
        preserveSummary.trim() ||
        `${space.description}. Co-created with ${space.activeParticipants.length} people before dissolving.`,
      keyArtifacts: [
        { type: 'text', title: 'Top Idea', content: space.ideas[0]?.title || 'Collaborative brainstorming session' },
        { type: 'music', title: 'Curated Audio', content: space.playlist.map((p) => p.title).join(', ') || 'Ambient audio' },
        { type: 'tags', title: 'Participants', content: space.activeParticipants.map((p) => p.name).join(', ') },
      ],
      collaborators: space.activeParticipants.map((p) => ({
        name: p.name,
        avatar: p.avatar,
        isGhost: p.isGhost,
      })),
      tags: [space.category, 'living-space', 'preserved'],
      coordinates: { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 },
      preservedAt: 'Just now',
    });
    setShowPreserveModal(false);
    addToast(`"${space.title}" preserved into your Memory Garden constellation`, 'aura');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 pb-32 sm:pb-28 transition-colors duration-200">
      {/* 1. COMPACT, PURPOSEFUL SPACE HEADER */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#060a17]/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-3">
          {/* Left: Back & Core Space Identity */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button
              onClick={leaveSpace}
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/10 icon-btn focus-ring cursor-pointer transition-all"
              title="Leave space and return to Orbit"
              aria-label="Leave space and return to Orbit"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
            </button>

            <div className="min-w-0 flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                  {space.category}
                </span>

                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  LIVE
                </span>

                <span className="hidden sm:flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-300">
                  <Zap className="h-3 w-3 shrink-0" />
                  {space.energy}
                </span>
              </div>

              <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                {space.title}
              </h1>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 font-mono text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-500/30 px-2 py-0.5 rounded-full">
                  <Clock className="h-3 w-3 shrink-0" />
                  Expires in {space.expiresAt}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Context Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end">
            {/* Live Ticker Toggle */}
            {space.tickerEvents.length > 0 && (
              <button
                onClick={() => setShowLiveTicker(!showLiveTicker)}
                className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white icon-btn focus-ring cursor-pointer"
                title="Toggle Live Pulse stream"
              >
                <Radio className="h-3 w-3 text-cyan-500 shrink-0" />
                <span className="text-[11px]">Pulse</span>
                {showLiveTicker ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
              </button>
            )}

            {/* Ghost toggle inside space */}
            <button
              onClick={toggleGhostMode}
              className={`hidden sm:flex btn-press focus-ring items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                isGhostMode
                  ? 'border-cyan-400 bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 shadow-xs'
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Toggle anonymous presence in this space"
            >
              <Ghost className="h-3.5 w-3.5 shrink-0" />
              <span>{isGhostMode ? 'Ghost Inside' : 'Reveal Identity'}</span>
            </button>

            {/* Preserve Space */}
            <button
              onClick={() => setShowPreserveModal(true)}
              className="btn-press focus-ring flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 shadow-xs cursor-pointer"
              title="Preserve this space's creations into your Memory Garden"
            >
              <BookmarkPlus className="h-3.5 w-3.5 shrink-0" />
              <span>Preserve</span>
            </button>
          </div>
        </div>

        {/* Optional Collapsible Pulse Ticker */}
        {showLiveTicker && space.tickerEvents.length > 0 && (
          <div className="mx-auto max-w-7xl mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 dark:text-slate-400 no-scrollbar animate-in fade-in duration-150">
            <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 shrink-0">
              <Radio className="h-3 w-3 animate-pulse" />
              Live Pulse:
            </span>
            <div className="flex items-center gap-2">
              {space.tickerEvents.map((event, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-100 dark:bg-white/[0.04] px-2.5 py-0.5 border border-slate-200 dark:border-white/5 whitespace-nowrap text-slate-700 dark:text-slate-300"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 space-y-4">
        {/* 2. LIVE PRESENCE STRIP & PRESENCE MODES */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] p-3 shadow-xs">
          {/* Active Participants Count & Ring */}
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              {space.activeParticipants.slice(0, 5).map((p, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer"
                  title={`${p.name} · ${p.isGhost ? 'Ghost Mode' : 'Connected'}`}
                >
                  {p.isGhost ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 border-2 border-white dark:border-[#060a17] text-cyan-300 text-[10px]">
                      🌫️
                    </div>
                  ) : (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="h-7 w-7 rounded-full object-cover border-2 border-white dark:border-[#060a17]"
                    />
                  )}
                </div>
              ))}
              {space.activeParticipants.length > 5 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 text-[10px] font-bold font-mono text-slate-700 dark:text-slate-300 border-2 border-white dark:border-[#060a17]">
                  +{space.activeParticipants.length - 5}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{space.activeParticipants.length} beings synchronized</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {space.description.slice(0, 65)}...
              </span>
            </div>
          </div>

          {/* Polished Presence Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-[#0c1224] p-1 rounded-xl border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 hidden sm:inline">
              Mode:
            </span>
            {PRESENCE_MODES.map((pm) => {
              const Icon = pm.icon;
              const isSelected = presenceMode === pm.mode;
              return (
                <button
                  key={pm.mode}
                  onClick={() => {
                    setPresenceMode(pm.mode);
                    addToast(`Presence mode set to ${pm.label}`, 'info');
                  }}
                  className={`chip-interactive focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.05]'
                  }`}
                  title={pm.desc}
                >
                  <Icon className="h-3 w-3" />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. COLLECTIVE GOAL MILESTONE SECTION */}
        {space.collectiveGoal && (
          <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-transparent p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Collective Milestone: {space.collectiveGoal.title}
                    </span>
                    {space.collectiveGoal.completed && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.2 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        Achieved!
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Shared room progress advances with every contribution
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
                  {space.collectiveGoal.current} / {space.collectiveGoal.target} {space.collectiveGoal.unit} (
                  {Math.min(100, Math.round((space.collectiveGoal.current / space.collectiveGoal.target) * 100))}%)
                </span>

                <button
                  onClick={() => {
                    contributeToCollectiveGoal(space.id, 1);
                    addToast('+1 Contribution added to Collective Milestone!', 'aura');
                  }}
                  disabled={space.collectiveGoal.completed}
                  className="btn-press focus-ring flex items-center gap-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Contribute</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((space.collectiveGoal.current / space.collectiveGoal.target) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* 4. PRIMARY WORKSPACE & ACTIVITY TABS */}
        <div className="pt-2">
          {/* Workspace Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 mb-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'canvas', label: 'Collaborative Canvas', icon: Sparkles, badge: space.canvasNotes.length },
              { id: 'ideas', label: 'Idea Wall', icon: Lightbulb, badge: space.ideas.length },
              { id: 'audio', label: 'Shared Audio Queue', icon: Music, badge: space.playlist.length },
              { id: 'stream', label: 'Live Pulse & Stream', icon: Radio, badge: space.messages.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`chip-interactive focus-ring flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-900 dark:text-white border border-cyan-500/40 dark:border-cyan-400/50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="rounded-full bg-slate-200 dark:bg-white/10 px-1.5 py-0.2 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: COLLABORATIVE SPATIAL CANVAS (Visual Centerpiece) */}
          {activeTab === 'canvas' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Quick Contribution Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090e1f] p-3 shadow-xs">
                <div className="flex flex-1 items-center gap-2 min-w-[220px]">
                  <input
                    type="text"
                    placeholder="Add a thought, frequency, or concept to the canvas..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickAddCanvasNote();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />

                  {/* Compact Color Pickers */}
                  <div className="flex items-center gap-1 shrink-0">
                    {['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setNoteColor(c)}
                        style={{ backgroundColor: c }}
                        className={`h-4 w-4 rounded-full transition-transform cursor-pointer ${
                          noteColor === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : 'opacity-65 hover:opacity-100'
                        }`}
                        title="Choose note color"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleQuickAddCanvasNote}
                    className="btn-press focus-ring flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-3.5 py-1.5 text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Drop Note</span>
                  </button>

                  <button
                    onClick={() => setIsDroppingNote(!isDroppingNote)}
                    className={`btn-press focus-ring flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                      isDroppingNote
                        ? 'border-amber-400 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 animate-pulse'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                    title="Click canvas surface to position precisely"
                  >
                    <span>{isDroppingNote ? 'Click Canvas to Place' : 'Target Position'}</span>
                  </button>
                </div>
              </div>

              {/* Spatial Canvas Surface */}
              <div
                onClick={handleDropCanvasNote}
                className={`relative h-[520px] w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-900 dark:bg-[#050711] bg-space-grid p-6 transition-all shadow-inner select-none ${
                  isDroppingNote ? 'cursor-crosshair ring-2 ring-cyan-400/60' : ''
                }`}
              >
                {/* Subtle Guidance Watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center opacity-15">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-widest text-slate-400">
                    Shared Ephemeral Canvas
                  </span>
                </div>

                {/* Canvas Notes */}
                {space.canvasNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      position: 'absolute',
                      left: `${note.x}%`,
                      top: `${note.y}%`,
                      borderColor: `${note.color}66`,
                      backgroundColor: `${note.color}25`,
                      boxShadow: `0 4px 20px ${note.color}35`,
                    }}
                    className="max-w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-3.5 backdrop-blur-md transition-all hover:scale-105 hover:z-20 cursor-default shadow-md"
                  >
                    <p className="text-xs font-medium text-white leading-relaxed drop-shadow-xs">{note.text}</p>
                    <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-1.5 text-[10px] text-white/80 font-mono">
                      <span>By {note.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IDEA WALL WITH PROGRESSIVE DISCLOSURE */}
          {activeTab === 'ideas' && (
            <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in duration-200">
              {/* Ideas List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    Brainstorm Wall ({space.ideas.length})
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Upvote concepts to build consensus</span>
                </div>

                {space.ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="card-interactive flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090d1c] p-4 transition-all shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      {idea.category && (
                        <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/30 px-2 py-0.2 text-[9px] font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider mb-1 inline-block">
                          {idea.category}
                        </span>
                      )}
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{idea.title}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                        Proposed by {idea.author}
                      </span>
                    </div>

                    <button
                      onClick={() => voteIdea(space.id, idea.id)}
                      className={`btn-press focus-ring flex flex-col items-center justify-center rounded-xl border px-3 py-2 transition-all cursor-pointer ${
                        idea.userVoted
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 shadow-xs'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Vote for this idea"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs font-mono font-bold mt-0.5">{idea.votes}</span>
                    </button>
                  </div>
                ))}

                {space.ideas.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No ideas added yet. Spark the first collaboration below!
                  </div>
                )}
              </div>

              {/* Add Idea Card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090e1f] p-5 h-fit shadow-xs">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>Propose Idea</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Surface a creative proposal or architectural angle for the space.
                </p>

                <form onSubmit={handleAddIdea} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Concept</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Synthesize generative chords modulated by spatial distance..."
                      value={newIdeaTitle}
                      onChange={(e) => setNewIdeaTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Category / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Synthesis, Research, Visuals"
                      value={newIdeaCategory}
                      onChange={(e) => setNewIdeaCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-press focus-ring w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Idea
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: SHARED AUDIO STREAM */}
          {activeTab === 'audio' && (
            <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in duration-200">
              <div className="lg:col-span-2 space-y-4">
                {/* Now Playing Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-r from-purple-50 via-slate-50 to-cyan-50 dark:from-purple-950/40 dark:via-[#0a0d1e] dark:to-cyan-950/30 p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-600 text-white shadow-md">
                        <Volume2 className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
                          Live Audio Frequency
                        </span>
                        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {space.playlist[0]?.title || 'Cosmic Deep Sine Drift'}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {space.playlist[0]?.artist || 'Live Room Synthesis'} · Added by{' '}
                          {space.playlist[0]?.addedBy || 'Host'}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-cyan-500 animate-pulse"
                          style={{
                            height: `${10 + (i % 3) * 8}px`,
                            animationDelay: `${i * 150}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Queue Header */}
                <div className="flex items-center justify-between pt-1">
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    Up Next in Shared Stream
                  </h4>
                  <button
                    onClick={() => setShowAddSong(!showAddSong)}
                    className="btn-press focus-ring flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs text-cyan-700 dark:text-cyan-300 hover:border-cyan-500 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Suggest Track</span>
                  </button>
                </div>

                {/* Add Track Form */}
                {showAddSong && (
                  <form
                    onSubmit={handleAddSong}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090d1c] p-4 flex flex-wrap gap-2 animate-in fade-in shadow-xs"
                  >
                    <input
                      type="text"
                      placeholder="Track Title (e.g. Solstice Resonance)"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      className="flex-1 min-w-[180px] rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Artist / Source"
                      value={songArtist}
                      onChange={(e) => setSongArtist(e.target.value)}
                      className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none w-44"
                    />
                    <button
                      type="submit"
                      className="btn-press focus-ring rounded-xl bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Add to Queue
                    </button>
                  </form>
                )}

                {/* Song List */}
                <div className="space-y-2">
                  {space.playlist.map((track, idx) => (
                    <div
                      key={track.id}
                      className="card-interactive flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-white/[0.02] p-3 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}</span>
                        <div>
                          <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{track.title}</h5>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {track.artist} · Added by {track.addedBy}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{track.duration}</span>
                        <button
                          onClick={() => upvoteSong(space.id, track.id)}
                          className={`btn-press focus-ring flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-mono transition-all cursor-pointer ${
                            track.userUpvoted
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{track.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Frequency Info */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090e1f] p-5 h-fit shadow-xs">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  Synchronized Room Audio
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  All participants share the exact same audio timeline in real time. Higher voted tracks ascend dynamically.
                </p>

                <div className="mt-4 rounded-xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-950/30 p-3 text-xs text-cyan-900 dark:text-cyan-200">
                  ✨ Current room energy: <strong className="uppercase">{space.energy}</strong>.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PULSE, STREAM & COMMUNAL POLLS */}
          {activeTab === 'stream' && (
            <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in duration-200">
              {/* Chat Stream */}
              <div className="lg:col-span-2 flex flex-col h-[520px] rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090d1c] p-4 shadow-xs">
                <div className="border-b border-slate-200 dark:border-white/10 pb-2.5 mb-3 flex items-center justify-between">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Ephemeral Chat Stream
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dissolves when room countdown expires
                  </span>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
                  {space.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 rounded-2xl p-3 ${
                        msg.sender.includes('You')
                          ? 'bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 ml-6'
                          : 'bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 mr-6'
                      }`}
                    >
                      {msg.isGhost ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-300 text-xs border border-cyan-500/30 shrink-0">
                          🌫️
                        </div>
                      ) : (
                        <img
                          src={msg.avatar}
                          alt={msg.sender}
                          className="h-7 w-7 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                  <input
                    type="text"
                    placeholder={isGhostMode ? 'Transmit anonymously as Ghost...' : 'Transmit message to space...'}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Send Message"
                    className="btn-press focus-ring flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-white transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

              {/* Communal Polls */}
              <div className="space-y-4">
                {space.polls.map((poll) => {
                  const totalVotes = poll.options.reduce((a, b) => a + b.votes, 0);
                  return (
                    <div
                      key={poll.id}
                      className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090e1f] p-5 shadow-xs"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                        Communal Poll
                      </span>
                      <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white mt-1 mb-3">
                        {poll.question}
                      </h4>

                      <div className="space-y-2">
                        {poll.options.map((opt, optIdx) => {
                          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          const isSelected = poll.userVotedIndex === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                votePoll(space.id, poll.id, optIdx);
                                addToast(`Voted: "${opt.text}"`, 'info');
                              }}
                              className={`btn-press group relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200'
                                  : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20'
                              }`}
                            >
                              <div
                                className="absolute inset-y-0 left-0 bg-cyan-500/15 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                              <div className="relative flex items-center justify-between text-xs">
                                <span className="font-medium text-slate-900 dark:text-white">{opt.text}</span>
                                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{pct}%</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. PRESERVATION MODAL */}
      {showPreserveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowPreserveModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-amber-500/40 bg-white dark:bg-[#090d1c] p-6 shadow-2xl text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-3 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Preserve into Memory Garden
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Living spaces dissolve when their countdown concludes. Preserving crystallizes the co-created notes, top ideas, and participants into a permanent constellation node in your Memory Garden.
            </p>

            <textarea
              rows={3}
              placeholder="Add your reflections or custom synthesis before immortalizing..."
              value={preserveSummary}
              onChange={(e) => setPreserveSummary(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPreserveModal(false)}
                className="btn-press focus-ring rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPreserve}
                className="btn-press focus-ring rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-sm transition-colors cursor-pointer"
              >
                Immortalize Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
