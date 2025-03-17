import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import { GetTasksDto } from "./dto/get-tasks.dto";

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  public getFilteredTasks(getTasksDto: GetTasksDto): Task[] {
    const { status, page = 1, sortBy, limit = this.tasks.length } = getTasksDto;

    const filteredTasks = status
      ? this.tasks.filter((task) => task.status === status)
      : this.tasks;

    if (filteredTasks.length === 0) {
      throw new NotFoundException("No tasks found");
    }

    const sortedTasks = sortBy
      ? [...filteredTasks].sort((a, b) => {
          const valueA = a[sortBy];
          const valueB = b[sortBy];

          if (typeof valueA === "string" && typeof valueB === "string") {
            return valueA.localeCompare(valueB);
          }

          return 0;
        })
      : filteredTasks;

    const paginatedTasks = sortedTasks.slice((page - 1) * limit, page * limit);
    if (paginatedTasks.length === 0) {
      return [];
    }

    return paginatedTasks;
  }
}
