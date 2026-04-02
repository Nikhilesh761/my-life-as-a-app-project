export interface Quest {
  id: string;
  title: string;
  category: 'health' | 'work' | 'learning' | 'social';
  completed: boolean;
  xpReward: number;
}

export interface UserStats {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  str: number;
  int: number;
  agi: number;
  cha: number;
  luck: number;
}

export interface MoodEntry {
  mood: 'ecstatic' | 'happy' | 'neutral' | 'tired' | 'stressed';
  energy: number;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type QuestCategory = Quest['category'];
