import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "./task.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private taskIdCounter = 1;

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException("Task does not exist");
    }

    return task;
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    this.tasks.push({
      id: String(this.taskIdCounter++),
      ...createTaskDto,
    });

    return this.tasks.at(-1);
  }

  public updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const updatedTask = this.getTaskById(id);
    Object.assign(updatedTask, updateTaskDto);

    return updatedTask;
  }

  public deleteTask(id: string): Task {
    const deletedTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return deletedTask;
  }
}
