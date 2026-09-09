import { create } from 'zustand';
import {
  Intent,
  IntentContract,
  EchoType,
  Moment,
  LivingSpace,
  RemixItem,
  Quest,
  Memory,
  NotificationItem,
  IdentityProfile,
  SocialMatch,
  SocialEnergy,
  FrequencyItem,
  EchoLink,
  PresenceMode,
  SessionStats,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_MOMENTS,
  INITIAL_SPACES,
  INITIAL_REMIXES,
  INITIAL_QUESTS,
  INITIAL_MEMORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PEOPLE_MATCHES,
  INITIAL_FREQUENCIES,
  INITIAL_ECHO_LINKS,
} from '../data/mockData';

export type ViewMode =
  | 'landing'
  | 'orbit'
  | 'spaces'
  | 'space_detail'
  | 'discover'
  | 'matches'
  | 'quests'
  | 'memories'
  | 'identity';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'aura';
}

export type ThemeMode = 'dark' | 'light' | 'system';

interface NexaState {
  theme: ThemeMode;
  currentView: ViewMode;
  selectedIntent: Intent;
  searchQuery: string;
  orbitDensity: 'compact' | 'balanced' | 'deep_space';
  showRadarSweep: boolean;
  showConstellationLines: boolean;
  isGhostMode: boolean;
  
  // Surgical Social Mechanics State
  socialEnergy: SocialEnergy;
  frequencies: FrequencyItem[];
  echoLinks: EchoLink[];
  celebratingEchoLink: EchoLink | null;
  presenceMode: PresenceMode;
  sessionStats: SessionStats;
  isFrequenciesOpen: boolean;
  isDriftOpen: boolean;
  isSessionMemoryOpen: boolean;
  isShortcutsHelpOpen: boolean;
  isUniversalSearchOpen: boolean;
  serendipityMomentId: string | null;
  userResonances: Record<string, { intensity: 'Gentle' | 'Harmonic' | 'Deep' | 'Transcendent'; value: number; timestamp: string }>;
  anchoredMomentIds: string[];
  activeIntentContract: IntentContract | null;
  isIntentContractOpen: boolean;

  currentUser: IdentityProfile;
  moments: Moment[];
  spaces: LivingSpace[];
  activeSpaceId: string | null;
  inspectingMomentId: string | null;
  isCreatingMoment: boolean;
  isRemixingMomentId: string | null;
  isConciergeOpen: boolean;
  isNotificationsOpen: boolean;
  
  remixes: RemixItem[];
  quests: Quest[];
  memories: Memory[];
  notifications: NotificationItem[];
  peopleMatches: SocialMatch[];
  toasts: ToastItem[];

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setCurrentView: (view: ViewMode) => void;
  setSelectedIntent: (intent: Intent) => void;
  setSearchQuery: (query: string) => void;
  setOrbitDensity: (density: 'compact' | 'balanced' | 'deep_space') => void;
  toggleRadarSweep: () => void;
  toggleConstellationLines: () => void;
  toggleGhostMode: () => void;

  // Surgical Social Mechanics Actions
  setSocialEnergy: (energy: SocialEnergy) => void;
  updateFrequency: (id: string, strength: number) => void;
  recordResonance: (momentId: string, percentage: number) => { intensity: 'Gentle' | 'Harmonic' | 'Deep' | 'Transcendent'; echoLinkCreated: boolean };
  anchorMoment: (momentId: string) => void;
  setPresenceMode: (mode: PresenceMode) => void;
  contributeToCollectiveGoal: (spaceId: string, amount?: number) => void;
  openDrift: (isOpen: boolean) => void;
  toggleFrequencies: (isOpen?: boolean) => void;
  toggleSessionMemory: (isOpen?: boolean) => void;
  triggerSurpriseMe: () => void;
  setCelebratingEchoLink: (link: EchoLink | null) => void;
  forgeEchoLinkWithUser: (person: SocialMatch) => void;
  toggleShortcutsHelp: (isOpen?: boolean) => void;
  toggleUniversalSearch: (isOpen?: boolean) => void;
  setIntentContract: (contract: IntentContract | null) => void;
  toggleIntentContract: (isOpen?: boolean) => void;
  
  inspectMoment: (momentId: string | null) => void;
  openSpace: (spaceId: string, enterAsGhost?: boolean) => void;
  leaveSpace: () => void;
  openCreateMoment: (isOpen: boolean) => void;
  openRemixModal: (momentId: string | null) => void;
  toggleConcierge: (isOpen?: boolean) => void;
  toggleNotifications: (isOpen?: boolean) => void;
  
  sendEcho: (momentId: string, echoType: EchoType) => void;
  createMoment: (momentData: {
    title: string;
    intent: Intent;
    description: string;
    durationLabel: string;
    lookingFor: string[];
    tags: string[];
    privacy: string;
  }) => Moment;
  addRemix: (remixData: {
    originalMomentId: string;
    originalTitle: string;
    originalCreator: string;
    remixType: RemixItem['remixType'];
    newTitle: string;
    newDescription: string;
    tags: string[];
  }) => void;
  
  addIdeaToSpace: (spaceId: string, title: string, category?: string) => void;
  voteIdea: (spaceId: string, ideaId: string) => void;
  addMessageToSpace: (spaceId: string, text: string) => void;
  votePoll: (spaceId: string, pollId: string, optionIndex: number) => void;
  addSongToPlaylist: (spaceId: string, title: string, artist: string) => void;
  upvoteSong: (spaceId: string, songId: string) => void;
  addCanvasNote: (spaceId: string, note: { text: string; color: string; x: number; y: number }) => void;
  
  toggleQuestStep: (questId: string, stepId: string) => void;
  claimQuest: (questId: string) => void;
  saveMemory: (memory: Omit<Memory, 'id'>) => void;
  deleteMemory: (memoryId: string) => void;
  
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  addToast: (message: string, type?: 'info' | 'success' | 'aura') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY = 'nexa_social_state_v1';
const THEME_STORAGE_KEY = 'nexa_theme';

export function applyThemeToDOM(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  }
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      return stored;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return 'dark'; // Dark is NEXA's signature aesthetic
}

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

// Listen for system theme changes when in system mode
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = getInitialTheme();
    if (current === 'system') {
      applyThemeToDOM('system');
    }
  });
}

function loadStoredState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load NEXA stored state:', e);
  }
  return null;
}

function persistState(state: Partial<NexaState>) {
  if (typeof window === 'undefined') return;
  try {
    const subset = {
      isGhostMode: state.isGhostMode,
      selectedIntent: state.selectedIntent,
      orbitDensity: state.orbitDensity,
      showRadarSweep: state.showRadarSweep,
      showConstellationLines: state.showConstellationLines,
      moments: state.moments,
      remixes: state.remixes,
      quests: state.quests,
      memories: state.memories,
      spaces: state.spaces,
      notifications: state.notifications,
      socialEnergy: state.socialEnergy,
      frequencies: state.frequencies,
      echoLinks: state.echoLinks,
      userResonances: state.userResonances,
      anchoredMomentIds: state.anchoredMomentIds,
      activeIntentContract: state.activeIntentContract,
      sessionStats: state.sessionStats,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subset));
  } catch (e) {
    console.error('Failed to persist NEXA state:', e);
  }
}

const saved = loadStoredState();

export const useNexaStore = create<NexaState>((set, get) => ({
  theme: initialTheme,
  currentView: 'orbit',
  selectedIntent: saved?.selectedIntent || 'ALL',
  searchQuery: '',
  orbitDensity: saved?.orbitDensity || 'balanced',
  showRadarSweep: saved?.showRadarSweep ?? true,
  showConstellationLines: saved?.showConstellationLines ?? true,
  isGhostMode: saved?.isGhostMode || false,

  // Surgical Social Mechanics State
  socialEnergy: saved?.socialEnergy || 'Social',
  frequencies: saved?.frequencies || INITIAL_FREQUENCIES,
  echoLinks: saved?.echoLinks || INITIAL_ECHO_LINKS,
  celebratingEchoLink: null,
  presenceMode: 'LISTEN',
  sessionStats: saved?.sessionStats || {
    momentsVisited: 0,
    spacesJoined: 0,
    resonancesRecorded: 0,
    ideasContributed: 0,
    linksFormed: 0,
    startTime: Date.now(),
  },
  isFrequenciesOpen: false,
  isDriftOpen: false,
  isSessionMemoryOpen: false,
  isShortcutsHelpOpen: false,
  isUniversalSearchOpen: false,
  serendipityMomentId: null,
  userResonances: saved?.userResonances || {},
  anchoredMomentIds: saved?.anchoredMomentIds || [],
  activeIntentContract: saved?.activeIntentContract || null,
  isIntentContractOpen: false,

  currentUser: INITIAL_USER,
  moments: saved?.moments || INITIAL_MOMENTS,
  spaces: saved?.spaces || INITIAL_SPACES,
  activeSpaceId: null,
  inspectingMomentId: null,
  isCreatingMoment: false,
  isRemixingMomentId: null,
  isConciergeOpen: false,
  isNotificationsOpen: false,

  remixes: saved?.remixes || INITIAL_REMIXES,
  quests: saved?.quests || INITIAL_QUESTS,
  memories: saved?.memories || INITIAL_MEMORIES,
  notifications: saved?.notifications || INITIAL_NOTIFICATIONS,
  peopleMatches: INITIAL_PEOPLE_MATCHES,
  toasts: [],

  setSocialEnergy: (energy) => {
    set({ socialEnergy: energy });
    get().addToast(`Social energy shifted to: ${energy}`, 'aura');
    persistState(get());
  },

  updateFrequency: (id, strength) => {
    set((s) => ({
      frequencies: s.frequencies.map((f) => (f.id === id ? { ...f, strength: Math.max(0, Math.min(100, strength)) } : f)),
    }));
    persistState(get());
  },

  recordResonance: (momentId, percentage) => {
    const intensity: 'Gentle' | 'Harmonic' | 'Deep' | 'Transcendent' =
      percentage >= 85 ? 'Transcendent' : percentage >= 60 ? 'Deep' : percentage >= 35 ? 'Harmonic' : 'Gentle';

    const moment = get().moments.find((m) => m.id === momentId);
    let echoLinkCreated = false;
    let newlyFormedLink: EchoLink | null = null;

    // Record user resonance
    const userResonances = {
      ...get().userResonances,
      [momentId]: { intensity, value: percentage, timestamp: 'Just now' },
    };

    // Increment echoes on moment
    const moments = get().moments.map((m) => {
      if (m.id !== momentId) return m;
      const echoes = { ...m.echoes, INSPIRED: (m.echoes.INSPIRED || 0) + 1 };
      return { ...m, echoes };
    });

    // Check if we should form or deepen an Echo Link with the creator
    let echoLinks = [...get().echoLinks];
    if (moment && !moment.creator.isGhost && moment.creator.name !== get().currentUser.name) {
      const existingLinkIndex = echoLinks.findIndex((l) => l.targetUserName === moment.creator.name);
      if (existingLinkIndex >= 0) {
        echoLinks[existingLinkIndex] = {
          ...echoLinks[existingLinkIndex],
          strength: Math.min(100, echoLinks[existingLinkIndex].strength + 10),
          resonanceType: `${intensity} Resonance`,
          lastInteraction: `Resonated with "${moment.title.slice(0, 28)}..."`,
          sharedMomentsCount: echoLinks[existingLinkIndex].sharedMomentsCount + 1,
        };
      } else if (percentage >= 50) {
        const newLink: EchoLink = {
          id: `link-${Date.now()}`,
          targetUserId: `u-${(moment.creator?.name || 'explorer').toLowerCase().replace(/\s+/g, '')}`,
          targetUserName: moment.creator.name,
          targetUserAvatar: moment.creator.avatar,
          targetUserHandle: moment.creator.handle,
          resonanceType: `${intensity} Resonance`,
          strength: Math.round(percentage),
          connectedSince: 'Just now',
          sharedMomentsCount: 1,
          lastInteraction: `Resonated on "${moment.title.slice(0, 24)}..."`,
        };
        echoLinks = [newLink, ...echoLinks];
        echoLinkCreated = true;
        newlyFormedLink = newLink;
      }
    }

    const sessionStats = {
      ...get().sessionStats,
      resonancesRecorded: get().sessionStats.resonancesRecorded + 1,
      linksFormed: echoLinkCreated ? get().sessionStats.linksFormed + 1 : get().sessionStats.linksFormed,
    };

    set({
      userResonances,
      moments,
      echoLinks,
      sessionStats,
      ...(newlyFormedLink ? { celebratingEchoLink: newlyFormedLink } : {}),
    });

    if (echoLinkCreated && moment) {
      get().addToast(`✦ Echo Link formed with ${moment.creator.name}!`, 'aura');
    } else {
      get().addToast(`Resonance registered (${intensity})`, 'aura');
    }

    persistState(get());
    return { intensity, echoLinkCreated };
  },

  anchorMoment: (momentId) => {
    const moment = get().moments.find((m) => m.id === momentId);
    if (!moment) return;

    const anchoredMomentIds = [...get().anchoredMomentIds, momentId];
    const moments = get().moments.map((m) =>
      m.id === momentId ? { ...m, lifecycleStatus: 'Anchored' as const, anchoredAt: 'Just now' } : m
    );

    // Also preserve to Memory Garden
    get().saveMemory({
      spaceTitle: `[Anchored] ${moment.title}`,
      summary: moment.description,
      keyArtifacts: [{ type: 'text', title: 'Anchored from Orbit', content: moment.currentActivity }],
      collaborators: [{ name: moment.creator.name, avatar: moment.creator.avatar, isGhost: moment.creator.isGhost }],
      tags: [...moment.tags, 'anchored', 'orbit'],
      coordinates: { x: moment.orbitAngle, y: moment.orbitDistance * 25 },
      preservedAt: 'Just now',
    });

    set({ anchoredMomentIds, moments });
    get().addToast(`✦ "${moment.title.slice(0, 24)}..." anchored permanently!`, 'aura');
    persistState(get());
  },

  setPresenceMode: (mode) => {
    set({ presenceMode: mode });
    get().addToast(`Presence: ${mode}`, 'info');
  },

  contributeToCollectiveGoal: (spaceId, amount = 1) => {
    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId || !sp.collectiveGoal) return sp;
      const current = Math.min(sp.collectiveGoal.target, sp.collectiveGoal.current + amount);
      const completed = current >= sp.collectiveGoal.target;
      return {
        ...sp,
        collectiveGoal: { ...sp.collectiveGoal, current, completed },
        tickerEvents: [`Collaborator advanced living orbit goal (${current}/${sp.collectiveGoal.target})`, ...sp.tickerEvents.slice(0, 3)],
      };
    });

    const sessionStats = {
      ...get().sessionStats,
      ideasContributed: get().sessionStats.ideasContributed + 1,
    };

    set({ spaces, sessionStats });
    get().addToast(`Living Orbit goal advanced!`, 'aura');
    persistState(get());
  },

  openDrift: (isOpen) => {
    set({ isDriftOpen: isOpen });
  },

  toggleFrequencies: (isOpen) => {
    set((s) => ({ isFrequenciesOpen: isOpen !== undefined ? isOpen : !s.isFrequenciesOpen }));
  },

  toggleSessionMemory: (isOpen) => {
    set((s) => ({ isSessionMemoryOpen: isOpen !== undefined ? isOpen : !s.isSessionMemoryOpen }));
  },

  triggerSurpriseMe: () => {
    const { moments, frequencies } = get();
    // Sort frequencies ascending to find least dominant interest
    const sortedFreqs = [...(frequencies || [])].sort((a, b) => a.strength - b.strength);
    const lowestFreq = sortedFreqs[0];
    
    // Find moments matching that interest or with rare intent
    const candidate =
      (lowestFreq?.category &&
        moments.find((m) =>
          m.tags?.some((t) => t && t.toLowerCase().includes(lowestFreq.category.toLowerCase().slice(0, 4)))
        )) ||
      moments[Math.floor(Math.random() * moments.length)];

    if (candidate) {
      set({ serendipityMomentId: candidate.id, inspectingMomentId: candidate.id });
      get().addToast(`✦ Serendipity: Stepping outside usual frequencies into "${candidate.title.slice(0, 24)}..."`, 'aura');
    }
  },

  setCelebratingEchoLink: (link) => {
    set({ celebratingEchoLink: link });
  },

  forgeEchoLinkWithUser: (person) => {
    const existing = get().echoLinks.find((l) => l.targetUserName === person.name);
    if (existing) {
      get().addToast(`You are already in resonance with ${person.name}`, 'info');
      return;
    }
    const newLink: EchoLink = {
      id: `link-${Date.now()}`,
      targetUserId: person.id,
      targetUserName: person.name,
      targetUserAvatar: person.avatar,
      targetUserHandle: `@${(person.name || 'explorer').toLowerCase().replace(/\s+/g, '')}`,
      resonanceType: 'Harmonic Resonance',
      strength: 92,
      connectedSince: 'Just now',
      sharedMomentsCount: 2,
      lastInteraction: 'Direct Echo Link forged across the Orbit',
    };
    const echoLinks = [newLink, ...get().echoLinks];
    const sessionStats = {
      ...get().sessionStats,
      linksFormed: get().sessionStats.linksFormed + 1,
    };
    set({ echoLinks, sessionStats, celebratingEchoLink: newLink });
    get().addToast(`✦ Echo Link formed with ${person.name}!`, 'aura');
    persistState(get());
  },

  toggleShortcutsHelp: (isOpen) => {
    set((s) => ({ isShortcutsHelpOpen: isOpen !== undefined ? isOpen : !s.isShortcutsHelpOpen }));
  },

  toggleUniversalSearch: (isOpen) => {
    set((s) => ({ isUniversalSearchOpen: isOpen !== undefined ? isOpen : !s.isUniversalSearchOpen }));
  },

  setIntentContract: (contract) => {
    set({ activeIntentContract: contract });
    if (contract) {
      set({ selectedIntent: contract.intent });
      get().addToast(`✦ Intent Contract Activated: "${contract.label}"`, 'aura');
    } else {
      get().addToast('Intent Contract released. Full orbit available.', 'info');
    }
    persistState(get());
  },

  toggleIntentContract: (isOpen) => {
    set((s) => ({ isIntentContractOpen: isOpen !== undefined ? isOpen : !s.isIntentContractOpen }));
  },

  setTheme: (theme) => {
    set({ theme });
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // Ignore
    }
    applyThemeToDOM(theme);
  },
  toggleTheme: () => {
    const current = get().theme;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setCurrentView: (view) => set({ currentView: view }),
  setSelectedIntent: (intent) => {
    set({ selectedIntent: intent });
    get().addToast(`Orbit aligned to ${intent}`, 'info');
    persistState(get());
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setOrbitDensity: (density) => {
    set({ orbitDensity: density });
    persistState(get());
  },
  toggleRadarSweep: () => {
    set((s) => ({ showRadarSweep: !s.showRadarSweep }));
    persistState(get());
  },
  toggleConstellationLines: () => {
    set((s) => ({ showConstellationLines: !s.showConstellationLines }));
    persistState(get());
  },
  toggleGhostMode: () => {
    const next = !get().isGhostMode;
    set({ isGhostMode: next });
    get().addToast(
      next ? '🌫️ Ghost Mode Activated — Participating anonymously' : '✨ Identity Restored — Participating as Kiran',
      'aura'
    );
    persistState(get());
  },

  inspectMoment: (momentId) => set({ inspectingMomentId: momentId }),
  
  openSpace: (spaceId, enterAsGhost) => {
    if (enterAsGhost !== undefined) {
      set({ isGhostMode: enterAsGhost });
    }
    const targetSpace = get().spaces.find((s) => s.id === spaceId);
    set({
      activeSpaceId: spaceId,
      currentView: 'space_detail',
      inspectingMomentId: null,
    });
    get().addToast(`Entered "${targetSpace?.title || 'Living Space'}"`, 'aura');
  },

  leaveSpace: () => set({ activeSpaceId: null, currentView: 'orbit' }),
  openCreateMoment: (isOpen) => set({ isCreatingMoment: isOpen }),
  openRemixModal: (momentId) => set({ isRemixingMomentId: momentId }),
  toggleConcierge: (isOpen) =>
    set((s) => ({ isConciergeOpen: isOpen !== undefined ? isOpen : !s.isConciergeOpen })),
  toggleNotifications: (isOpen) =>
    set((s) => ({ isNotificationsOpen: isOpen !== undefined ? isOpen : !s.isNotificationsOpen })),

  sendEcho: (momentId, echoType) => {
    const moments = get().moments.map((m) => {
      if (m.id !== momentId) return m;
      const alreadyEchoed = m.userEchoed?.includes(echoType);
      const newEchoes = { ...m.echoes };
      let newUserEchoed = m.userEchoed ? [...m.userEchoed] : [];

      if (alreadyEchoed) {
        newEchoes[echoType] = Math.max(0, newEchoes[echoType] - 1);
        newUserEchoed = newUserEchoed.filter((e) => e !== echoType);
      } else {
        newEchoes[echoType] = (newEchoes[echoType] || 0) + 1;
        newUserEchoed.push(echoType);
      }
      return { ...m, echoes: newEchoes, userEchoed: newUserEchoed };
    });

    set({ moments });
    get().addToast(`Resonated: "${echoType}"`, 'aura');
    persistState(get());
  },

  createMoment: (data) => {
    const isGhost = get().isGhostMode;
    const newId = `m-${Date.now()}`;
    const newSpaceId = `space-${Date.now()}`;
    
    // Pick vibrant constellation colors based on intent
    const colors: Record<Intent, string> = {
      ALL: '#38bdf8',
      CREATE: '#8b5cf6',
      DISCOVER: '#06b6d4',
      CONNECT: '#f43f5e',
      LEARN: '#10b981',
      PLAY: '#f59e0b',
      HELP: '#ec4899',
      'JUST VIBE': '#0ea5e9',
    };

    const newMoment: Moment = {
      id: newId,
      title: data.title,
      creator: {
        name: isGhost ? '🌫️ Anonymous Ghost' : get().currentUser.name,
        handle: isGhost ? '@anonymous' : get().currentUser.handle,
        avatar: isGhost ? '' : get().currentUser.avatar,
        isGhost,
      },
      intent: data.intent,
      description: data.description,
      participantsCount: 1,
      energy: data.intent === 'CREATE' ? 'Collaborative' : data.intent === 'PLAY' ? 'High Energy' : 'Reflective',
      expiresAt: data.durationLabel === '30 Min' ? '00:30:00' : data.durationLabel === '1 Hour' ? '01:00:00' : '02:45:00',
      durationLabel: data.durationLabel,
      tags: (data.tags && data.tags.length > 0) ? data.tags : ['NEXA', (data.intent || 'DISCOVER').toLowerCase()],
      currentActivity: 'Just launched into your Orbit — waiting for first participant',
      lookingFor: data.lookingFor.length > 0 ? data.lookingFor : ['Collaborators', 'Curious minds'],
      echoes: { SAME: 1, 'FELT THIS': 0, CURIOUS: 2, 'I CAN HELP': 0, INSPIRED: 3 },
      remixesCount: 0,
      spaceId: newSpaceId,
      orbitDistance: 1, // launches in close orbit
      orbitAngle: Math.floor(Math.random() * 360),
      accentColor: colors[data.intent] || '#38bdf8',
      iconName: data.intent === 'CREATE' ? 'Sparkles' : data.intent === 'HELP' ? 'LifeBuoy' : 'Radio',
      createdAt: 'Just now',
    };

    // Create corresponding Living Space
    const newSpace: LivingSpace = {
      id: newSpaceId,
      momentId: newId,
      title: data.title,
      category: `${data.intent} Space`,
      description: data.description,
      energy: newMoment.energy,
      expiresAt: newMoment.expiresAt,
      durationLabel: data.durationLabel,
      activeParticipants: [
        {
          id: 'u-self',
          name: isGhost ? '🌫️ Anonymous (You)' : `${get().currentUser.name} (You)`,
          avatar: isGhost ? '' : get().currentUser.avatar,
          isGhost,
          role: 'Host',
        },
      ],
      tickerEvents: ['You launched this Living Space into the Orbit', 'Listening for incoming resonance'],
      ideas: [],
      playlist: [],
      polls: [],
      canvasNotes: [
        {
          id: `c-${Date.now()}`,
          text: `Welcome to "${data.title}"! Add an idea or drop a note below.`,
          author: isGhost ? 'Anonymous' : get().currentUser.name,
          color: newMoment.accentColor,
          x: 40,
          y: 35,
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: isGhost ? '🌫️ Anonymous (You)' : get().currentUser.name,
          avatar: isGhost ? '' : get().currentUser.avatar,
          isGhost,
          message: `Opened this moment with intent: ${data.intent}. Let's make something together!`,
          timestamp: 'Just now',
          echoCount: 1,
        },
      ],
    };

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'space_active',
      text: `Your moment "${data.title}" launched into the Orbit.`,
      subtext: `Inviting collaborators under intent ${data.intent}.`,
      timestamp: 'Just now',
      read: false,
      targetMomentId: newId,
      targetSpaceId: newSpaceId,
    };

    set((s) => ({
      moments: [newMoment, ...s.moments],
      spaces: [newSpace, ...s.spaces],
      notifications: [newNotification, ...s.notifications],
      isCreatingMoment: false,
      currentUser: {
        ...s.currentUser,
        momentsCreatedCount: s.currentUser.momentsCreatedCount + 1,
      },
    }));

    get().addToast(`Moment launched into your Orbit!`, 'aura');
    persistState(get());
    return newMoment;
  },

  addRemix: (data) => {
    const newRemix: RemixItem = {
      id: `remix-${Date.now()}`,
      originalMomentId: data.originalMomentId,
      originalTitle: data.originalTitle,
      originalCreator: data.originalCreator,
      remixType: data.remixType,
      newTitle: data.newTitle,
      newDescription: data.newDescription,
      creator: {
        name: get().isGhostMode ? '🌫️ Anonymous Ghost' : get().currentUser.name,
        avatar: get().isGhostMode ? '' : get().currentUser.avatar,
      },
      createdAt: 'Just now',
      echoes: 1,
      tags: data.tags,
    };

    // Update original moment remix count
    const moments = get().moments.map((m) =>
      m.id === data.originalMomentId ? { ...m, remixesCount: m.remixesCount + 1 } : m
    );

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'remix_used',
      text: `You created a remix of "${data.originalTitle}".`,
      subtext: `${data.remixType}: "${data.newTitle}" is now part of the constellation.`,
      timestamp: 'Just now',
      read: false,
    };

    set((s) => ({
      remixes: [newRemix, ...s.remixes],
      moments,
      notifications: [newNotification, ...s.notifications],
      isRemixingMomentId: null,
      currentUser: {
        ...s.currentUser,
        remixesCount: s.currentUser.remixesCount + 1,
      },
    }));

    get().addToast(`Remix completed: ${data.remixType}`, 'aura');
    persistState(get());
  },

  addIdeaToSpace: (spaceId, title, category) => {
    const author = get().isGhostMode ? '🌫️ Anonymous Ghost' : get().currentUser.name;
    const newIdea = {
      id: `idea-${Date.now()}`,
      title,
      author,
      votes: 1,
      userVoted: true,
      category: category || 'General',
    };

    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      return {
        ...sp,
        ideas: [newIdea, ...sp.ideas],
        tickerEvents: [`${author} added new idea: "${title.slice(0, 32)}..."`, ...sp.tickerEvents.slice(0, 4)],
      };
    });

    set({ spaces });
    get().addToast('Idea added to collaborative board', 'success');
    persistState(get());
  },

  voteIdea: (spaceId, ideaId) => {
    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      const ideas = sp.ideas.map((idea) => {
        if (idea.id !== ideaId) return idea;
        const userVoted = !idea.userVoted;
        return {
          ...idea,
          votes: userVoted ? idea.votes + 1 : Math.max(0, idea.votes - 1),
          userVoted,
        };
      });
      return { ...sp, ideas };
    });

    set({ spaces });
    persistState(get());
  },

  addMessageToSpace: (spaceId, text) => {
    const isGhost = get().isGhostMode;
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: isGhost ? '🌫️ Anonymous' : get().currentUser.name,
      avatar: isGhost ? '' : get().currentUser.avatar,
      isGhost,
      message: text,
      timestamp: 'Just now',
      echoCount: 0,
    };

    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      return {
        ...sp,
        messages: [...sp.messages, newMessage],
        tickerEvents: [`${newMessage.sender} commented: "${text.slice(0, 24)}..."`, ...sp.tickerEvents.slice(0, 4)],
      };
    });

    set({ spaces });
    persistState(get());
  },

  votePoll: (spaceId, pollId, optionIndex) => {
    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      const polls = sp.polls.map((p) => {
        if (p.id !== pollId) return p;
        if (p.userVotedIndex === optionIndex) return p; // already voted
        const newOptions = p.options.map((opt, idx) => {
          if (idx === optionIndex) return { ...opt, votes: opt.votes + 1 };
          if (idx === p.userVotedIndex) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });
        return { ...p, options: newOptions, userVotedIndex: optionIndex };
      });
      return { ...sp, polls };
    });

    set({ spaces });
    get().addToast('Vote registered on communal poll', 'info');
    persistState(get());
  },

  addSongToPlaylist: (spaceId, title, artist) => {
    const addedBy = get().isGhostMode ? 'Anonymous' : get().currentUser.name;
    const newTrack = {
      id: `p-${Date.now()}`,
      title,
      artist,
      addedBy,
      duration: '3:45',
      upvotes: 1,
      userUpvoted: true,
    };

    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      return {
        ...sp,
        playlist: [...sp.playlist, newTrack],
        tickerEvents: [`${addedBy} added "${title}" by ${artist}`, ...sp.tickerEvents.slice(0, 4)],
      };
    });

    set({ spaces });
    get().addToast(`Added track to collaborative queue`, 'aura');
    persistState(get());
  },

  upvoteSong: (spaceId, songId) => {
    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      const playlist = sp.playlist.map((track) => {
        if (track.id !== songId) return track;
        const userUpvoted = !track.userUpvoted;
        return {
          ...track,
          upvotes: userUpvoted ? track.upvotes + 1 : Math.max(0, track.upvotes - 1),
          userUpvoted,
        };
      });
      return { ...sp, playlist };
    });

    set({ spaces });
    persistState(get());
  },

  addCanvasNote: (spaceId, note) => {
    const spaces = get().spaces.map((sp) => {
      if (sp.id !== spaceId) return sp;
      const newNote = {
        id: `c-${Date.now()}`,
        text: note.text,
        author: get().isGhostMode ? 'Anonymous' : get().currentUser.name,
        color: note.color,
        x: note.x,
        y: note.y,
      };
      return {
        ...sp,
        canvasNotes: [...sp.canvasNotes, newNote],
        tickerEvents: [`New canvas note dropped at [${note.x}%, ${note.y}%]`, ...sp.tickerEvents.slice(0, 4)],
      };
    });

    set({ spaces });
    get().addToast('Dropped note on collaborative canvas', 'success');
    persistState(get());
  },

  toggleQuestStep: (questId, stepId) => {
    const quests = get().quests.map((q) => {
      if (q.id !== questId) return q;
      const steps = q.steps.map((st) => (st.id === stepId ? { ...st, completed: !st.completed } : st));
      return { ...q, steps };
    });

    set({ quests });
    persistState(get());
  },

  claimQuest: (questId) => {
    const quests = get().quests.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q));
    const quest = quests.find((q) => q.id === questId);
    set({ quests });
    get().addToast(`Quest reward claimed: ${quest?.reward || 'Stardust'}!`, 'aura');
    persistState(get());
  },

  saveMemory: (memory) => {
    const newMemory: Memory = {
      ...memory,
      id: `mem-${Date.now()}`,
    };

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'memory_created',
      text: `Preserved "${memory.spaceTitle}" in your Memory Garden.`,
      subtext: `Coordinates: [${memory.coordinates.x}, ${memory.coordinates.y}]`,
      timestamp: 'Just now',
      read: false,
    };

    set((s) => ({
      memories: [newMemory, ...s.memories],
      notifications: [newNotification, ...s.notifications],
    }));

    get().addToast('Space preserved into Memory Garden constellation', 'aura');
    persistState(get());
  },

  deleteMemory: (memoryId) => {
    set((s) => ({
      memories: s.memories.filter((m) => m.id !== memoryId),
    }));
    get().addToast('Memory returned to stardust', 'info');
    persistState(get());
  },

  markNotificationRead: (notifId) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
    }));
    persistState(get());
  },

  markAllNotificationsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
    get().addToast('All notifications marked as read', 'info');
    persistState(get());
  },

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((s) => ({
      toasts: [...s.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    }));
  },
}));
