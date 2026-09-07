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
  CheckCircle2,
  Share2,
  Volume2,
  Headphones,
  Mic,
  PenTool,
  Eye,
  Target,
} from 'lucide-react';

const PRESENCE_MODES: { mode: PresenceMode; label: string; icon: React.ElementType }[] = [
  { mode: 'LISTEN', label: 'Listen', icon: Headphones },
  { mode: 'TALK', label: 'Talk', icon: Mic },
  { mode: 'CREATE', label: 'Create', icon: PenTool },
  { mode: 'OBSERVE', label: 'Observe', icon: Eye },
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

  const [activeTab, setActiveTab] = useState<'canvas' | 'ideas' | 'audio' | 'chat'>('canvas');
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaCategory, setNewIdeaCategory] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showPreserveModal, setShowPreserveModal] = useState(false);
  const [preserveSummary, setPreserveSummary] = useState('');

  // Canvas note creation state
  const [isDroppingNote, setIsDroppingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteColor, setNoteColor] = useState('#06b6d4');

  const space = spaces.find((s) => s.id === activeSpaceId);

  if (!space) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 bg-[#04060d] text-white">
        <h2 className="font-display text-xl font-bold">Living Space Not Found or Expired</h2>
        <p className="mt-2 text-sm text-slate-400">This temporary room may have already dissolved into stardust.</p>
        <button
          onClick={leaveSpace}
          className="mt-4 rounded-full bg-cyan-500 px-5 py-2 text-xs font-bold text-black"
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
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;
    addSongToPlaylist(space.id, songTitle.trim(), songArtist.trim() || 'Community Member');
    setSongTitle('');
    setSongArtist('');
    setShowAddSong(false);
  };

  const handleDropCanvasNote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDroppingNote) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    if (noteText.trim()) {
      addCanvasNote(space.id, {
        text: noteText.trim(),
        color: noteColor,
        x: Math.max(5, Math.min(90, x)),
        y: Math.max(5, Math.min(90, y)),
      });
      setNoteText('');
      setIsDroppingNote(false);
    } else {
      addToast('Please write your note text before dropping', 'info');
    }
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
    <div className="min-h-screen bg-[var(--bg-app)] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 pb-28 sm:pb-24 transition-colors duration-200">
      {/* Top Space Bar */}
      <div className="sticky top-14 z-30 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#060a17]/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Left: Back & Space Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={leaveSpace}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all icon-btn focus-ring cursor-pointer"
              title="Leave space and return to Orbit"
              aria-label="Leave space and return to Orbit"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  {space.category}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  <Clock className="h-3 w-3" />
                  Expires in {space.expiresAt}
                </span>
                <span className="hidden sm:flex items-center gap-1 text-xs text-purple-300">
                  <Zap className="h-3 w-3" />
                  {space.energy}
                </span>
              </div>
              <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {space.title}
              </h1>
            </div>
          </div>

          {/* Right: Mode & Actions */}
          <div className="flex items-center gap-2">
            {/* Ghost toggle inside space */}
            <button
              onClick={toggleGhostMode}
              className={`btn-press focus-ring flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium cursor-pointer ${
                isGhostMode
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 shadow-xs'
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ghost className="h-3.5 w-3.5" />
              <span>{isGhostMode ? 'Ghost Inside' : 'Reveal Identity'}</span>
            </button>

            {/* Preserve Space */}
            <button
              onClick={() => setShowPreserveModal(true)}
              className="btn-press focus-ring flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 shadow-xs cursor-pointer"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Preserve Memory</span>
            </button>
          </div>
        </div>

        {/* Live Activity Ticker */}
        {space.tickerEvents.length > 0 && (
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 dark:text-slate-400 no-scrollbar">
            <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 shrink-0">
              <Radio className="h-3 w-3 animate-pulse" />
              Live Pulse:
            </span>
            <div className="flex items-center gap-3">
              {space.tickerEvents.map((event, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-100 dark:bg-white/[0.03] px-2 py-0.5 border border-slate-200 dark:border-white/5 whitespace-nowrap text-slate-700 dark:text-slate-300"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Participants Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active In Space:
            </span>
            <div className="flex items-center -space-x-1.5">
              {space.activeParticipants.map((p, idx) => (
                <div key={idx} className="relative group cursor-pointer" title={`${p.name} (${p.role || 'Member'})`}>
                  {p.isGhost ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs">
                      🌫️
                    </div>
                  ) : (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="h-7 w-7 rounded-full object-cover border border-white/20"
                    />
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-cyan-700 dark:text-cyan-300 font-mono font-medium">
              {space.activeParticipants.length} beings synchronized
            </span>
          </div>

          {/* Presence Mode Selector (Talk, Listen, Create, Observe) */}
          <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-[#0c1224] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-1.5">
              Presence:
            </span>
            {PRESENCE_MODES.map((pm) => {
              const Icon = pm.icon;
              const isSelected = presenceMode === pm.mode;
              return (
                <button
                  key={pm.mode}
                  onClick={() => setPresenceMode(pm.mode)}
                  className={`chip-interactive focus-ring flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.04]'
                  }`}
                  title={`Set presence to ${pm.label}`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Living Orbit: Communal Goal Section */}
        {space.collectiveGoal && (
          <div className="mt-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-transparent p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <Target className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Living Orbit Goal: {space.collectiveGoal.title}
                    </span>
                    {space.collectiveGoal.completed && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.2 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        Achieved!
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Shared room milestone powered by collective actions
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
                  {space.collectiveGoal.current} / {space.collectiveGoal.target} {space.collectiveGoal.unit}
                </span>

                <button
                  onClick={() => contributeToCollectiveGoal(space.id, 1)}
                  disabled={space.collectiveGoal.completed}
                  className="btn-press focus-ring flex items-center gap-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  <span>Contribute</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((space.collectiveGoal.current / space.collectiveGoal.target) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace with Tabs */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'canvas', label: 'Collaborative Canvas', icon: Sparkles, badge: space.canvasNotes.length },
            { id: 'ideas', label: 'Idea Wall', icon: Lightbulb, badge: space.ideas.length },
            { id: 'audio', label: 'Shared Audio Queue', icon: Music, badge: space.playlist.length },
            { id: 'chat', label: 'Live Stream & Polls', icon: Radio, badge: space.messages.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`chip-interactive focus-ring flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-900 dark:text-white border border-cyan-500/40 dark:border-cyan-400/50 shadow-xs'
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

        {/* Tab 1: Collaborative Spatial Canvas */}
        {activeTab === 'canvas' && (
          <div className="space-y-4">
            {/* Canvas Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090e1f] p-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Drop Note on Canvas:</span>
                <input
                  type="text"
                  placeholder="Write a thought or concept..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none w-full sm:w-80 min-w-0"
                />

                {/* Color pickers */}
                <div className="flex items-center gap-1.5">
                  {['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setNoteColor(c)}
                      style={{ backgroundColor: c }}
                      className={`h-5 w-5 rounded-full transition-transform ${
                        noteColor === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!noteText.trim()) {
                    addToast('Type your note first, then click anywhere on the canvas', 'info');
                  }
                  setIsDroppingNote(!isDroppingNote);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isDroppingNote
                    ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>{isDroppingNote ? 'Click on Canvas to Place' : 'Prepare Sticky Note'}</span>
              </button>
            </div>

            {/* Canvas Surface */}
            <div
              onClick={handleDropCanvasNote}
              className={`relative h-[550px] w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-900 dark:bg-[#050711] bg-space-grid p-6 transition-all ${
                isDroppingNote ? 'cursor-crosshair ring-2 ring-cyan-400/50' : ''
              }`}
            >
              {/* Guidance watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center opacity-20">
                <span className="font-display text-4xl font-extrabold uppercase tracking-widest text-slate-400">
                  Shared Ephemeral Canvas
                </span>
              </div>

              {/* Placed Canvas Notes */}
              {space.canvasNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    position: 'absolute',
                    left: `${note.x}%`,
                    top: `${note.y}%`,
                    borderColor: `${note.color}66`,
                    backgroundColor: `${note.color}25`,
                    boxShadow: `0 0 20px ${note.color}35`,
                  }}
                  className="max-w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-3.5 backdrop-blur-md transition-transform hover:scale-105 hover:z-20 shadow-md"
                >
                  <p className="text-xs font-semibold text-white leading-relaxed drop-shadow-xs">{note.text}</p>
                  <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-1.5 text-[10px] text-white/80 font-mono">
                    <span>By {note.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Idea Wall with Voting */}
        {activeTab === 'ideas' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Ideas List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Collaborative Brainstorm Wall</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{space.ideas.length} ideas surfaced</span>
              </div>

              {space.ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090d1c] p-4 transition-all hover:border-slate-300 dark:hover:border-white/20 shadow-xs"
                >
                  <div className="flex-1">
                    {idea.category && (
                      <span className="rounded bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider mb-1.5 inline-block">
                        {idea.category}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{idea.title}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Proposed by {idea.author}</span>
                  </div>

                  <button
                    onClick={() => voteIdea(space.id, idea.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border px-3.5 py-2 transition-all ${
                      idea.userVoted
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                    }`}
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

            {/* Right: Add Idea Card */}
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090e1f] p-5 h-fit shadow-xs">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Add An Idea to the Wall</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Post a suggestion, feature concept, or creative angle for the room to upvote.
              </p>

              <form onSubmit={handleAddIdea} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Idea Title / Concept</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Generative chord progressions modulated by cosmic ray detector..."
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
                  className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  Submit Idea
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Shared Audio / Playlist Queue */}
        {activeTab === 'audio' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Playlist Queue */}
            <div className="lg:col-span-2 space-y-4">
              {/* Now Playing Banner */}
              <div className="relative overflow-hidden rounded-3xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-r from-purple-50 via-slate-50 to-cyan-50 dark:from-purple-950/40 dark:via-[#0a0d1e] dark:to-cyan-950/30 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-600 text-white shadow-md">
                      <Volume2 className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300">
                        Synchronized Ambient Audio Stream
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        {space.playlist[0]?.title || 'Cosmic Deep Sine Drift'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Artist: {space.playlist[0]?.artist || 'Live Room Synthesis'} · Added by{' '}
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
                          height: `${12 + (i % 3) * 10}px`,
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Queue Header */}
              <div className="flex items-center justify-between pt-2">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">Up Next in Communal Queue</h4>
                <button
                  onClick={() => setShowAddSong(!showAddSong)}
                  className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs text-cyan-700 dark:text-cyan-300 hover:border-cyan-500"
                >
                  <Plus className="h-3.5 w-3.5" />
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
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none w-48"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-xs font-bold text-white transition-colors"
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
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] shadow-xs"
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
                        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-mono transition-all ${
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

            {/* Audio Room Info */}
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090e1f] p-5 h-fit shadow-xs">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-2">Sonic Synthesis Environment</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All participants in this Living Space share an identical audio timeline. When a track is upvoted, it ascends higher in the shared stream.
              </p>

              <div className="mt-4 rounded-xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-950/30 p-3 text-xs text-cyan-900 dark:text-cyan-200">
                ✨ Pro-tip: Suggest ambient, binaural, or generative stems that suit the room's energy: <strong>{space.energy}</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Live Stream, Chat & Polls */}
        {activeTab === 'chat' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chat Stream */}
            <div className="lg:col-span-2 flex flex-col h-[550px] rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090d1c] p-4 shadow-xs">
              <div className="border-b border-slate-200 dark:border-white/10 pb-3 mb-3 flex items-center justify-between">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Ephemeral Chat Stream
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dissolves when room expires
                </span>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {space.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 rounded-2xl p-3 ${
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

                    <div className="flex-1">
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
                  placeholder={isGhostMode ? 'Message anonymously as Ghost...' : 'Transmit message to space...'}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-white transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Polls & Live Room Activity */}
            <div className="space-y-4">
              {space.polls.map((poll) => {
                const totalVotes = poll.options.reduce((a, b) => a + b.votes, 0);
                return (
                  <div
                    key={poll.id}
                    className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090e1f] p-5 shadow-xs"
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
                            onClick={() => votePoll(space.id, poll.id, optIdx)}
                            className={`group relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-all ${
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

      {/* Preservation Modal */}
      {showPreserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-amber-500/40 bg-white dark:bg-[#090d1c] p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Preserve into Memory Garden</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Living spaces are temporary and dissolve when their countdown finishes. Preserving crystallizes the notes, ideas, and participants into a permanent glowing node in your Memory Garden.
            </p>

            <textarea
              rows={3}
              placeholder="Add your reflections or custom synthesis..."
              value={preserveSummary}
              onChange={(e) => setPreserveSummary(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:outline-none mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPreserveModal(false)}
                className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPreserve}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs font-bold text-slate-950 transition-colors"
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
