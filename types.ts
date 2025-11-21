export interface Post {
  content: string;
  timestamp: string;
  date: Date;
}

export interface ActivityData {
  hour: number;
  count: number;
}

export interface AiSummary {
  bio: string;
  tags: string[];
  vibe: string;
  themeColor: string;
}
