export type Intent =
  | 'ALL'
  | 'CREATE'
  | 'DISCOVER'
  | 'CONNECT'
  | 'LEARN'
  | 'PLAY'
  | 'HELP'
  | 'JUST VIBE';

export type SocialEnergy = 'Quiet' | 'Curious' | 'Social' | 'Creative' | 'Chaotic';

export type PresenceMode = 'TALK' | 'LISTEN' | 'CREATE' | 'OBSERVE';

export interface FrequencyItem {
  id: string;
  category: string;
  label: string;
  strength: number; // 0 to 100
  icon: string;
  description: string;
}

export interface EchoLink {
  id: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string;
  targetUserHandle: string;
  resonanceType: string;
  strength: number; // 0 to 100
  connectedSince: string;
  sharedMomentsCount: number;
  lastInteraction: string;
}

export interface CollectiveGoal {
  title: string;
  current: number;
  target: number;
  unit: string;
  completed?: boolean;
}

export interface SessionStats {
  momentsVisited: number;
  spacesJoined: number;
  resonancesRecorded: number;
  ideasContributed: number;
  linksFormed: number;
  startTime: number;
}

export type EnergyLevel =
  | 'Collaborative'
  | 'Reflective'
  | 'High Energy'
  | 'Gentle'
  | 'Exploratory'
  | 'Deep Focus';

export type EchoType = 'SAME' | 'FELT THIS' | 'CURIOUS' | 'I CAN HELP' | 'INSPIRED';

export interface Creator {
  name: string;
  avatar: string;
  handle: string;
  isGhost?: boolean;
}

export interface Moment {
  id: string;
  title: string;
  creator: Creator;
  intent: Intent;
  description: string;
  participantsCount: number;
  energy: EnergyLevel;
  expiresAt: string;
  durationLabel: string;
  tags: string[];
  currentActivity: string;
  lookingFor: string[];
  echoes: Record<EchoType, number>;
  userEchoed?: EchoType[];
  remixesCount: number;
  spaceId: string;
  orbitDistance: number; // 1: inner orbit, 2: mid orbit, 3: outer orbit
  orbitAngle: number; // 0 to 360 degrees
  accentColor: string;
  iconName: string;
  createdAt: string;
  isSaved?: boolean;
  lifecycleStatus?: 'Fresh' | 'Expiring' | 'Anchored';
  anchoredAt?: string;
  primaryFrequency?: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  author: string;
  votes: number;
  userVoted?: boolean;
  category?: string;
}

export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  duration: string;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface PollItem {
  id: string;
  question: string;
  options: PollOption[];
  userVotedIndex?: number;
}

export interface CanvasNote {
  id: string;
  text: string;
  author: string;
  color: string;
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  isGhost?: boolean;
  message: string;
  timestamp: string;
  echoCount?: number;
}

export interface LivingSpace {
  id: string;
  momentId: string;
  title: string;
  category: string;
  description: string;
  energy: EnergyLevel;
  expiresAt: string;
  durationLabel: string;
  activeParticipants: {
    id: string;
    name: string;
    avatar: string;
    isGhost?: boolean;
    role?: string;
  }[];
  tickerEvents: string[];
  ideas: IdeaItem[];
  playlist: PlaylistItem[];
  polls: PollItem[];
  canvasNotes: CanvasNote[];
  messages: ChatMessage[];
  ambientTrack?: string;
  collectiveGoal?: CollectiveGoal;
  energyRating?: number; // 1 to 5 (e.g. ● ● ● ● ○)
  livingOrbit?: boolean;
}

export interface RemixItem {
  id: string;
  originalMomentId: string;
  originalTitle: string;
  originalCreator: string;
  remixType:
    | 'Thought → Playlist'
    | 'Photo → Poem'
    | 'Playlist → Visual Moodboard'
    | 'Question → Challenge'
    | 'Idea → Product Concept'
    | 'expand_thought'
    | 'musical_layer'
    | 'challenge_spin'
    | 'living_space'
    | 'format_translation';
  newTitle: string;
  newDescription: string;
  creator: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  echoes: number;
  tags: string[];
}

export interface SocialMatch {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  handle?: string;
  bio?: string;
  compatibility: number;
  resonanceScore?: number;
  sharedInterests: string[];
  sharedCuriosities?: string[];
  matchReason: string;
  whyMatched?: string;
  suggestedAction: string;
  suggestedSpaceId?: string;
  activeInSpaces?: string[];
  intent: Intent;
}

export interface QuestStep {
  id: string;
  text: string;
  title?: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category?: string;
  difficulty: 'Gentle' | 'Explorer' | 'Collaborator' | 'Legend';
  estimatedTime: string;
  steps: QuestStep[];
  participantsCount: number;
  reward: string;
  isClaimed?: boolean;
  iconName: string;
}

export interface MemoryArtifact {
  type: string;
  title: string;
  content: string;
}

export interface Memory {
  id: string;
  spaceTitle: string;
  momentTitle?: string;
  date?: string;
  preservedAt?: string;
  outcome?: string;
  summary?: string;
  participants?: {
    name: string;
    avatar: string;
    isGhost?: boolean;
  }[];
  collaborators?: {
    name: string;
    avatar: string;
    isGhost?: boolean;
  }[];
  creations?: string[];
  keyArtifacts?: MemoryArtifact[];
  highlightedTakeaway?: string;
  tags: string[];
  glowColor?: string;
  coordinates: { x: number; y: number };
}

export interface NotificationItem {
  id: string;
  type:
    | 'idea_join'
    | 'answer_wait'
    | 'remix_used'
    | 'idea_useful'
    | 'space_active'
    | 'memory_created'
    | 'echo_received';
  text: string;
  subtext?: string;
  timestamp: string;
  read: boolean;
  targetSpaceId?: string;
  targetMomentId?: string;
}

export interface IdentityProfile {
  name: string;
  handle: string;
  avatar: string;
  isGhost: boolean;
  statement?: string;
  bio?: string;
  auraTitle?: string;
  signature?: {
    creator: number;
    explorer: number;
    connector: number;
    learner: number;
    builder: number;
  };
  interests?: {
    name: string;
    category: string;
    strength: number; // 1-100
  }[];
  curiosities?: string[];
  intentDistribution?: {
    intent: string;
    percentage: number;
  }[];
  spacesJoinedCount: number;
  momentsCreatedCount: number;
  remixesCount: number;
  resonancesCount?: number;
  memoriesPreservedCount?: number;
}
