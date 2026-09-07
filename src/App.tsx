import React, { useEffect } from 'react';
import { useNexaStore } from './store/useNexaStore';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingView } from './components/landing/LandingView';
import { OrbitView } from './components/orbit/OrbitView';
import { MomentInspectionModal } from './components/orbit/MomentInspectionModal';
import { SpacesOverview } from './components/spaces/SpacesOverview';
import { LivingSpaceDetail } from './components/spaces/LivingSpaceDetail';
import { DiscoverAliveView } from './components/discover/DiscoverAliveView';
import { MatchesView } from './components/matches/MatchesView';
import { QuestsView } from './components/quests/QuestsView';
import { MemoryGardenView } from './components/memories/MemoryGardenView';
import { IdentityMapView } from './components/identity/IdentityMapView';
import { CreateMomentModal } from './components/modals/CreateMomentModal';
import { RemixModal } from './components/modals/RemixModal';
import { ConciergeDrawer } from './components/concierge/ConciergeDrawer';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { FrequenciesPopover } from './components/common/FrequenciesPopover';
import { DriftModal } from './components/discover/DriftModal';
import { SessionMemoryModal } from './components/common/SessionMemoryModal';
import { EchoLinkCelebration } from './components/common/EchoLinkCelebration';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { UniversalSearchModal } from './components/common/UniversalSearchModal';

export default function App() {
  const {
    currentView,
    setCurrentView,
    inspectMoment,
    openCreateMoment,
    openRemixModal,
    toggleConcierge,
    toggleNotifications,
    toggleFrequencies,
    openDrift,
    toggleSessionMemory,
    toggleShortcutsHelp,
    toggleUniversalSearch,
    setCelebratingEchoLink,
  } = useNexaStore();

  // Desktop Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      // Handle Escape: Close all modals & drawers
      if (e.key === 'Escape') {
        inspectMoment(null);
        openCreateMoment(false);
        openRemixModal(null);
        toggleConcierge(false);
        toggleNotifications(false);
        toggleFrequencies(false);
        openDrift(false);
        toggleSessionMemory(false);
        toggleShortcutsHelp(false);
        toggleUniversalSearch(false);
        setCelebratingEchoLink(null);
        return;
      }

      // Handle key triggers
      switch (e.key) {
        case 'o':
        case 'O':
          setCurrentView('orbit');
          break;
        case 's':
        case 'S':
          setCurrentView('spaces');
          break;
        case 'm':
        case 'M':
          setCurrentView('memories');
          break;
        case 'q':
        case 'Q':
          setCurrentView('quests');
          break;
        case 'p':
        case 'P':
          setCurrentView('matches');
          break;
        case 'i':
        case 'I':
          setCurrentView('identity');
          break;
        case '/':
          e.preventDefault();
          toggleUniversalSearch(true);
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          toggleConcierge();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFrequencies();
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          openDrift(true);
          break;
        case '?':
          e.preventDefault();
          toggleShortcutsHelp();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setCurrentView,
    inspectMoment,
    openCreateMoment,
    openRemixModal,
    toggleConcierge,
    toggleNotifications,
    toggleFrequencies,
    openDrift,
    toggleSessionMemory,
    toggleShortcutsHelp,
    toggleUniversalSearch,
    setCelebratingEchoLink,
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-cyan-500/30 transition-colors duration-200">
      {/* Persistent Spatial Header */}
      <Header />

      {/* Main Content Area switching between revolutionary views */}
      <main id="nexa-main-viewport" className="relative">
        {currentView === 'landing' && <LandingView />}
        {currentView === 'orbit' && <OrbitView />}
        {currentView === 'spaces' && <SpacesOverview />}
        {currentView === 'space_detail' && <LivingSpaceDetail />}
        {currentView === 'discover' && <DiscoverAliveView />}
        {currentView === 'matches' && <MatchesView />}
        {currentView === 'quests' && <QuestsView />}
        {currentView === 'memories' && <MemoryGardenView />}
        {currentView === 'identity' && <IdentityMapView />}
      </main>

      {/* Bottom Floating Navigation (Desktop pill + Mobile fixed bar) */}
      <Navigation />

      {/* Modals & Slide-out Drawers */}
      <MomentInspectionModal />
      <CreateMomentModal />
      <RemixModal />
      <ConciergeDrawer />
      <NotificationsDrawer />
      <FrequenciesPopover />
      <DriftModal />
      <SessionMemoryModal />
      <EchoLinkCelebration />
      <KeyboardShortcutsModal />
      <UniversalSearchModal />
      <ToastContainer />
    </div>
  );
}
