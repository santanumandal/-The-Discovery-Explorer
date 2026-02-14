
export interface Milestone {
  year: string;
  event: string;
  impact: string;
  imagePrompt: string;
}

export interface ReferenceLink {
  title: string;
  url: string;
}

export interface StoryData {
  topic: string;
  summary: string;
  origin: {
    period: string;
    description: string;
    imagePrompt: string;
  };
  milestones: Milestone[];
  currentForm: {
    status: string;
    description: string;
    imagePrompt: string;
  };
  futureNarrative: {
    speculation: string;
    vision: string;
    imagePrompt: string;
  };
  references: ReferenceLink[];
}

export interface CommunityStory {
  id: string;
  topic: string;
  author: string;
  content: string;
  references: string;
  status: 'published' | 'pending';
  date: string;
}

export enum AppState {
  HOME = 'HOME',
  LOADING = 'LOADING',
  STORY = 'STORY',
  COMMUNITY = 'COMMUNITY'
}
