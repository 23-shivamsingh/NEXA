import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Radio,
  Users,
  Plus,
  Award,
  Sparkles,
  HeartHandshake,
  Bell,
  Search,
  Sun,
  Moon,
  Ghost,
  Shield,
  Compass,
  User,
  Settings,
} from 'lucide-react';
import { useNexaStore, ViewMode } from '../../store/useNexaStore';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const {
    currentView,
    setCurrentView,
    openCreateMoment,
    toggleConcierge,
    toggleNotifications,
    notifications,
    currentUser,
    theme,
    toggleTheme,
    isGhostMode,
    toggleGhostMode,
  } = useNexaStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    onClose();
  };

  const handleCreate = () => {
    onClose();
    openCreateMoment(true);
  };

  const handleOpenNotifications = () => {
    onClose();
    toggleNotifications(true);
  };

  const handleOpenConcierge = () => {
    onClose();
    toggleConcierge(true);
  };

  const handleSearchClick = () => {
    onClose();
    onOpenSearch();
  };

  const mainNavItems: {
    view: ViewMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { view: 'orbit', label: 'Orbit', icon: Radio },
    { view: 'spaces', label: 'Spaces', icon: Users },
    { view: 'quests', label: 'Quests', icon: Award },
    { view: 'memories', label: 'Memories', icon: Sparkles },
    { view: 'matches', label: 'People', icon: HeartHandshake },
    { view: 'identity', label: 'You', icon: User },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          {/* Subtle Dark / Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-label="Close navigation"
          />

          {/* Drawer Panel: Slide from Left -> Right */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              paddingLeft: 'env(safe-area-inset-left, 0px)',
            }}
            className="relative z-10 flex h-full w-[290px] sm:w-[320px] max-w-[85vw] flex-col border-r border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#070b18] text-slate-900 dark:text-slate-100 shadow-2xl overflow-y-auto no-scrollbar"
          >
            {/* Header: NEXA Brand & Tagline + Close Button */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-white/[0.07]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    <Radio className="h-4 w-4" />
                  </div>
                  <span className="font-display text-lg font-bold tracking-wider text-slate-900 dark:text-white">
                    NEXA
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No feed. Just moments.
                </p>
              </div>

              <button
                id="drawer-close-btn"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Search Row */}
            <div className="px-3 pt-3">
              <button
                onClick={handleSearchClick}
                className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3.5 text-xs text-slate-500 dark:text-slate-400 hover:border-cyan-500/40 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Search className="h-4 w-4 text-slate-400" />
                <span>Search moments, spaces, people...</span>
              </button>
            </div>

            {/* Main Navigation Rows */}
            <div className="px-3 py-3 space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentView === item.view ||
                  (item.view === 'spaces' && currentView === 'space_detail');
                return (
                  <button
                    key={item.view}
                    id={`drawer-nav-${item.view}`}
                    onClick={() => handleNavigate(item.view)}
                    className={`flex w-full min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* + Create Action */}
              <button
                id="drawer-nav-create"
                onClick={handleCreate}
                className="flex w-full min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs">
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <span>Create Moment</span>
              </button>
            </div>

            {/* Divider */}
            <div className="mx-4 my-1 border-t border-slate-100 dark:border-white/[0.06]" />

            {/* Secondary Services: Notifications, Concierge, Settings */}
            <div className="px-3 py-2 space-y-1">
              {/* Notifications */}
              <button
                id="drawer-nav-notifications"
                onClick={handleOpenNotifications}
                className="flex w-full min-h-[44px] items-center justify-between rounded-xl px-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* AI Concierge */}
              <button
                id="drawer-nav-concierge"
                onClick={handleOpenConcierge}
                className="flex w-full min-h-[44px] items-center justify-between rounded-xl px-3.5 text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>AI Concierge</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
                  Navigator
                </span>
              </button>

              {/* Settings */}
              <button
                id="drawer-nav-settings"
                className="flex w-full min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => {
                  /* Handle settings */
                  onClose();
                }}
              >
                <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Settings</span>
              </button>

              {/* Theme Toggle in Drawer (Requirement 6) */}
              <div className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-indigo-400 shrink-0" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span>Theme</span>
                </div>
                <button
                  id="drawer-theme-toggle"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-500/40 transition-colors"
                >
                  <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
              </div>

              {/* Ghost Mode Toggle */}
              <div className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <Ghost className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Ghost Mode</span>
                </div>
                <button
                  id="drawer-ghost-toggle"
                  onClick={toggleGhostMode}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isGhostMode
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {isGhostMode ? 'Active' : 'Off'}
                </button>
              </div>

              {/* Manifesto Link */}
              <button
                onClick={() => handleNavigate('landing')}
                className="flex w-full min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Compass className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Manifesto & Story</span>
              </button>
            </div>

            {/* Bottom Profile Row */}
            <div className="mt-auto p-4 border-t border-slate-100 dark:border-white/[0.07] bg-slate-50/50 dark:bg-white/[0.01]">
              <button
                id="drawer-profile-btn"
                onClick={() => handleNavigate('identity')}
                className="flex w-full min-h-[44px] items-center gap-3 rounded-xl p-2 text-left hover:bg-white dark:hover:bg-white/[0.05] transition-colors"
              >
                <div className="relative shrink-0">
                  {isGhostMode ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                      <Ghost className="h-5 w-5" />
                    </div>
                  ) : (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                    />
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070b18]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {isGhostMode ? 'Anonymous Ghost' : currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Explorer • View Profile
                  </div>
                </div>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
