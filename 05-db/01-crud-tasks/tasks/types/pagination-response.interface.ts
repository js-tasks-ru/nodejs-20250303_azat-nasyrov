import { Task } from "../entities/task.entity";

export interface PaginationResponseInterface {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
