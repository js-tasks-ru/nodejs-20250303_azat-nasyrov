export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum TaskSortBy {
  TITLE = "title",
  STATUS = "status",
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}
