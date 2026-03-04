export type EnergyLevel = 'fog' | 'steady' | 'hyperfocus';

export type TaskCategory = 'work' | 'selfcare' | 'chores' | 'creative' | 'social';

export type TimeUnit = 'minutes' | 'hours' | 'seconds' | 'days';

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: number;
  scheduledDate?: string; // ISO date string - AI-recommended or user-scheduled day
  addedToToday?: boolean; // True if user manually added this to today's tasks
}

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  estimatedMinutes: number;
  estimatedTime?: number; // Original time value
  timeUnit?: TimeUnit; // Original time unit
  energyRequired: number; // 1-10
  urgency: number; // 1-10
  importance: number; // 1-10
  deadline?: string; // ISO date string
  isRevealed?: boolean;
  createdAt: number;
  subtasks?: Subtask[]; // Optional subtasks
  isGlobal?: boolean; // True if deadline is not today
  parentTaskId?: string; // For tracking which global task this belongs to
}

export interface CompletedTask extends Task {
  completedAt: number;
  timeSpent: number; // in seconds
  flowerType: 'rose' | 'daisy' | 'sunflower' | 'lavender';
  completedSubtaskId?: string; // If this completion was for a specific subtask
}

export interface GlobalTaskBouquet {
  taskId: string;
  taskName: string;
  date: string; // ISO date string for which day this bouquet is from
  flowers: CompletedTask[];
  deadline: string;
}