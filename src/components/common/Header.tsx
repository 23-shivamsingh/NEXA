import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  Ghost,
  Search,
  Zap,
  Radio,
  Sun,
  Moon,
  Compass,
  SlidersHorizontal,
  X,
  Keyboard,
} from 'lucide-react';
import { useNexaStore } from '../../store/useNexaStore';
import { Intent } from '../../types';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileSearchOverlay } from './MobileSearchOverlay';
import { Tooltip } from './Tooltip';

const INTENTS: { id: Intent; label: string; icon: string }[] = [
  { id: 'ALL', label: 'All', icon: '🌌' },
  { id: 'CREATE', label: 'Create', icon: '⚡' },
  { id: 'DISCOVER', label: 'Discover', icon: '🧭' },
  { id: 'CONNECT', label: 'Connect', icon: '🤝' },
  { id: 'LEARN', label: 'Learn', icon: '🌱' },
  { id: 'PLAY', label: 'Play', icon: '🎲' },
  { id: 'HELP', label: 'Help', icon: '🛟' },
  { id: 'JUST VIBE', label: 'Just Vibe', icon: '🌊' },
];

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedIntent,
    setSelectedIntent,
    searchQuery,
    setSearchQuery,
    isGhostMode,
    toggleGhostMode,
    currentUser,
    notifications,
    toggleNotifications,
    toggleConcierge,
    theme,
    toggleTheme,
    orbitDensity,
    setOrbitDensity,
    showRadarSweep,
    toggleRadarSweep,
    toggleFrequencies,
    toggleSessionMemory,
    toggleUniversalSearch,
    toggleShortcutsHelp,
  } = useNexaStore();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header
        id="nexa-header"
        className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.07] bg-white/90 dark:bg-[#050814]/90 backdrop-blur-xl transition-colors duration-200"
      >
        {/* =======================================================
            MOBILE HEADER (<= 768px): CLEAN, MINIMAL & PRODUCTION READY
            Left: ☰ Hamburger menu (animates to X)
            Center: NEXA logo / wordmark
            Right: Search & Profile avatar
            Height: 56px
            ======================================================= */}
        <div className="flex h-14 items-center justify-between px-3 md:hidden">
          {/* LEFT: ☰ Hamburger Button */}
          <button
            id="mobile-hamburger-btn"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all focus-ring cursor-pointer"
          >
            <div className="flex flex-col justify-center items-center w-5 h-5 gap-1.5 pointer-events-none">
              <span
                className={`h-0.5 w-5 rounded-full bg-current transform transition-all duration-200 ${
                  isMobileNavOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
                  isMobileNavOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-current transform transition-all duration-200 ${
                  isMobileNavOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>

          {/* CENTER: NEXA Brand Logo & Wordmark */}
          <button
            id="mobile-brand-logo-btn"
            onClick={() => setCurrentView('orbit')}
            className="flex items-center gap-1.5 focus-ring rounded-lg p-1 group cursor-pointer"
            title="Return to Orbit"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-xs group-hover:scale-105 group-active:scale-95 transition-transform">
              <Radio className="h-3.5 w-3.5" />
            </div>
            <span className="font-display text-base font-bold tracking-wider text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              NEXA
            </span>
          </button>

          {/* RIGHT: Search icon & Profile Avatar */}
          <div className="flex items-center gap-1">
            <button
              id="mobile-header-search-btn"
              onClick={() => setIsMobileSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:scale-95 transition-all focus-ring cursor-pointer"
              title="Search"
              aria-label="Search moments, spaces, people"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              id="mobile-header-avatar-btn"
              onClick={() => setCurrentView('identity')}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform active:scale-95 focus-ring cursor-pointer"
              title="Your Profile"
              aria-label="Open profile"
            >
              {isGhostMode ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 hover:scale-105 transition-transform">
                  <Ghost className="h-3.5 w-3.5" />
                </div>
              ) : (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-7 w-7 rounded-lg object-cover border border-slate-200 dark:border-white/10 hover:border-cyan-500 transition-colors"
                />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-[#050814]" />
              )}
            </button>
          </div>
        </div>

        {/* =======================================================
            DESKTOP HEADER (> 768px): COMPLETE DESKTOP WORKSPACE
            Untouched and preserved per requirement
            ======================================================= */}
        <div className="mx-auto hidden md:flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Left: Brand Identity & Manifesto Quick Link */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentView('orbit')}
              className="group flex items-center gap-2 text-left focus-ring rounded-xl p-1 cursor-pointer"
              title="Return to Orbit"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/20 text-cyan-600 dark:text-cyan-400 shadow-xs transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                <Radio className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base font-bold tracking-wider text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  NEXA
                </span>
                <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                  NO-FEED
                </span>
              </div>
            </button>

            {/* Quick toggle to Manifesto / Orbit */}
            <button
              id="btn-switch-landing"
              onClick={() => setCurrentView(currentView === 'landing' ? 'orbit' : 'landing')}
              className={`btn-press focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>{currentView === 'landing' ? 'Orbit' : 'About'}</span>
            </button>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="flex-1 max-w-sm md:max-w-md mx-4">
            <button
              id="global-search-trigger"
              onClick={() => toggleUniversalSearch(true)}
              className="relative w-full flex items-center justify-between h-8 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.03] px-3 text-xs text-slate-400 dark:text-slate-500 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-white/[0.06] hover:shadow-xs transition-all cursor-pointer text-left focus-ring"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">
                  {searchQuery || "Search moments, spaces, people..."}
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-2xs">
                /
              </kbd>
            </button>
          </div>

          {/* Right: Desktop Action Controls */}
          <div className="flex items-center gap-2">
            {/* Keyboard Shortcuts Hint */}
            <Tooltip content="Shortcuts (?)">
              <button
                id="shortcuts-help-btn"
                onClick={() => toggleShortcutsHelp()}
                aria-label="Keyboard Shortcuts"
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] icon-btn focus-ring cursor-pointer"
              >
                <Keyboard className="h-4 w-4" />
              </button>
            </Tooltip>

            {/* Theme Toggle (Sun / Moon) */}
            <Tooltip content={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] icon-btn focus-ring cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-amber-300 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="h-4 w-4 text-indigo-600 hover:-rotate-12 transition-transform" />
                )}
              </button>
            </Tooltip>

            {/* AI Concierge Trigger */}
            <button
              id="ai-concierge-trigger"
              onClick={() => toggleConcierge()}
              title="Ask AI Concierge"
              className="btn-press focus-ring flex h-8 items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              <span className="inline">Concierge</span>
            </button>

            {/* Notifications Bell */}
            <Tooltip content="Notifications">
              <button
                id="notifications-bell-btn"
                onClick={() => toggleNotifications()}
                aria-label="Notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] icon-btn focus-ring cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-600 dark:bg-cyan-500 px-1 text-[9px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Tooltip>

            {/* Ghost Mode Toggle */}
            <Tooltip content={isGhostMode ? 'Ghost Mode Active (Anonymous)' : 'Ghost Mode Inactive (Visible)'}>
              <button
                id="ghost-mode-toggle"
                onClick={toggleGhostMode}
                className={`btn-press focus-ring flex h-8 items-center gap-1 rounded-lg border px-2 text-xs font-medium cursor-pointer ${
                  isGhostMode
                    ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                }`}
              >
                <Ghost className="h-3.5 w-3.5" />
                <span className="inline">{isGhostMode ? 'Ghost' : 'Visible'}</span>
              </button>
            </Tooltip>

            {/* Orbit View Settings Dropdown */}
            {currentView === 'orbit' && (
              <div className="relative">
                <Tooltip content="Orbit Settings">
                  <button
                    id="orbit-settings-btn"
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    aria-label="Orbit Display Settings"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] icon-btn focus-ring cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>

                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1126] p-3 shadow-xl backdrop-blur-2xl z-50 text-xs animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="mb-2 font-semibold text-slate-900 dark:text-white">Orbit Settings</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Node Density</span>
                        <div className="mt-1 flex gap-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] p-0.5">
                          {(['compact', 'balanced', 'deep_space'] as const).map((d) => (
                            <button
                              key={d}
                              onClick={() => {
                                setOrbitDensity(d);
                                setShowSettingsMenu(false);
                              }}
                              className={`flex-1 rounded-md py-1 text-[10px] font-medium capitalize btn-press focus-ring cursor-pointer ${
                                orbitDensity === d
                                  ? 'bg-white dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {d === 'deep_space' ? 'Far' : d}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRadarSweep()}
                        className="btn-press focus-ring flex w-full items-center justify-between rounded-lg py-1 px-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.04] cursor-pointer"
                      >
                        <span>Radar Sweep</span>
                        <span className="font-mono text-[10px] font-bold">{showRadarSweep ? 'ON' : 'OFF'}</span>
                      </button>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-1">
                        <button
                          onClick={() => {
                            toggleFrequencies(true);
                            setShowSettingsMenu(false);
                          }}
                          className="btn-press focus-ring flex w-full items-center justify-between rounded-lg py-1 px-1.5 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 font-semibold text-[11px] cursor-pointer"
                        >
                          <span>✦ Tune Frequencies</span>
                        </button>
                        <button
                          onClick={() => {
                            toggleSessionMemory(true);
                            setShowSettingsMenu(false);
                          }}
                          className="btn-press focus-ring flex w-full items-center justify-between rounded-lg py-1 px-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold text-[11px] cursor-pointer"
                        >
                          <span>✦ Session Pulse</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Identity / Profile Avatar */}
            <Tooltip content="Identity Map & Aura">
              <button
                id="profile-avatar-btn"
                onClick={() => setCurrentView('identity')}
                aria-label="Your Identity Map"
                className={`flex items-center rounded-lg border p-0.5 icon-btn focus-ring cursor-pointer ${
                  currentView === 'identity'
                    ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {isGhostMode ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-300">
                    <Ghost className="h-4 w-4" />
                  </div>
                ) : (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-md object-cover"
                  />
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Sub-header Intent Filter Bar: Hidden on Mobile, Visible on Desktop */}
        <div className="hidden md:block border-t border-slate-200/60 dark:border-white/[0.04] bg-slate-50/90 dark:bg-[#04060d]/80 px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Zap className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              <span>Intent:</span>
            </span>
            {INTENTS.map((intent) => {
              const isSelected = selectedIntent === intent.id;
              return (
                <button
                  key={intent.id}
                  id={`intent-filter-${intent.id.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setSelectedIntent(intent.id)}
                  className={`chip-interactive focus-ring flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 dark:bg-cyan-500/20 text-white dark:text-cyan-200 border border-cyan-600 dark:border-cyan-400/40 shadow-xs font-semibold'
                      : 'bg-white dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-xs">{intent.icon}</span>
                  <span>{intent.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsMobileSearchOpen(true)}
      />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
};
