export type TaskType = 'one-time' | 'recurring';
export type TaskCategory = 'work' | 'health' | 'personal' | 'learning' | 'finance' | 'general';

export interface ITask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: TaskCategory;
  type: TaskType;
  isCompleted: boolean;
  scheduledFor: string; // ISO Date for deadline/start time
  completedAt?: string;
  // strictMode: boolean; // Implied true for now
}

export interface ICreateTaskDTO {
  title: string;
  category?: TaskCategory;
  scheduledFor: string;
}
