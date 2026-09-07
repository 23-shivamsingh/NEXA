import React from 'react';
import {
  Radio,
  Users,
  Plus,
  Award,
  Sparkles,
  User,
  HeartHandshake,
} from 'lucide-react';
import { useNexaStore, ViewMode } from '../../store/useNexaStore';

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView, openCreateMoment } = useNexaStore();

  // Desktop navigation dock items: Orbit, Spaces, Quests, Memories, People (Matches), You
  const desktopNavItems: {
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
    <>
      {/* =======================================================
          MOBILE FIXED BOTTOM NAVIGATION (<= 768px)
          Strictly 5 items: Orbit | Spaces | + | Quests | You
          Every item >= 44px touch target area
          ======================================================= */}
      <nav
        id="mobile-bottom-nav"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        className="fixed bottom-0 left-0 right-0 z-40 flex h-[calc(4rem+env(safe-area-inset-bottom,0px))] items-center justify-around border-t border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#070b18]/95 px-2 backdrop-blur-2xl md:hidden transition-colors duration-200"
        aria-label="Mobile navigation"
      >
        {/* 1. Orbit */}
        <button
          id="mobile-nav-orbit"
          onClick={() => setCurrentView('orbit')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[52px] py-1 px-2 transition-all active:scale-95 focus-ring rounded-xl cursor-pointer ${
            currentView === 'orbit'
              ? 'text-cyan-600 dark:text-cyan-400 font-medium'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Orbit view"
        >
          <Radio className="h-5 w-5 shrink-0 transition-transform group-active:scale-90" />
          <span className="text-[10px] tracking-tight mt-0.5">Orbit</span>
        </button>

        {/* 2. Spaces */}
        <button
          id="mobile-nav-spaces"
          onClick={() => setCurrentView('spaces')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[52px] py-1 px-2 transition-all active:scale-95 focus-ring rounded-xl cursor-pointer ${
            currentView === 'spaces' || currentView === 'space_detail'
              ? 'text-cyan-600 dark:text-cyan-400 font-medium'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Spaces view"
        >
          <Users className="h-5 w-5 shrink-0 transition-transform group-active:scale-90" />
          <span className="text-[10px] tracking-tight mt-0.5">Spaces</span>
        </button>

        {/* 3. Center Prominent Action: + (Create Moment) */}
        <button
          id="btn-create-moment-mobile"
          onClick={() => openCreateMoment(true)}
          className="relative -top-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all focus-ring cursor-pointer"
          title="Create Moment"
          aria-label="Create Moment"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>

        {/* 4. Quests */}
        <button
          id="mobile-nav-quests"
          onClick={() => setCurrentView('quests')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[52px] py-1 px-2 transition-all active:scale-95 focus-ring rounded-xl cursor-pointer ${
            currentView === 'quests'
              ? 'text-cyan-600 dark:text-cyan-400 font-medium'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Quests view"
        >
          <Award className="h-5 w-5 shrink-0 transition-transform group-active:scale-90" />
          <span className="text-[10px] tracking-tight mt-0.5">Quests</span>
        </button>

        {/* 5. You (Identity) */}
        <button
          id="mobile-nav-identity"
          onClick={() => setCurrentView('identity')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[52px] py-1 px-2 transition-all active:scale-95 focus-ring rounded-xl cursor-pointer ${
            currentView === 'identity'
              ? 'text-cyan-600 dark:text-cyan-400 font-medium'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Your profile"
        >
          <User className="h-5 w-5 shrink-0 transition-transform group-active:scale-90" />
          <span className="text-[10px] tracking-tight mt-0.5">You</span>
        </button>
      </nav>

      {/* =======================================================
          DESKTOP FLOATING NAVIGATION DOCK (> 768px)
          Untouched and preserved per requirement
          ======================================================= */}
      <aside
        id="desktop-floating-nav"
        className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090d1a]/85 p-1.5 shadow-xl shadow-slate-900/5 dark:shadow-black/40 backdrop-blur-2xl md:flex transition-colors duration-200"
        aria-label="Desktop navigation"
      >
        {desktopNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.view ||
            (item.view === 'spaces' && currentView === 'space_detail');
          return (
            <button
              key={item.view}
              id={`nav-${item.view}`}
              onClick={() => setCurrentView(item.view)}
              className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium btn-press focus-ring cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-slate-100 dark:bg-white/[0.08] text-cyan-700 dark:text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-xs" />
              )}
            </button>
          );
        })}

        <div className="mx-1.5 h-4 w-px bg-slate-200 dark:bg-white/10" />

        {/* Primary Launch Action */}
        <button
          id="btn-create-moment-desktop"
          onClick={() => openCreateMoment(true)}
          className="btn-press focus-ring flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm hover:shadow-md hover:shadow-cyan-500/25 hover:opacity-95 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Launch</span>
        </button>
      </aside>
    </>
  );
};
