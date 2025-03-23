import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { UsersService } from "../users/users.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const user = this.usersService.getUserById(assignedTo);

    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };

    this.tasks.push(task);
    await this.notificationsService.sendEmail(
      user.email,
      "Новая задача",
      `Вы назначены ответственным за задачу: "${title}"`,
    );

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    Object.assign(task, updateTaskDto);
    const user = this.usersService.getUserById(task.assignedTo);

    if (updateTaskDto.status) {
      await this.notificationsService.sendSMS(
        user.phone,
        `Статус задачи "${task.title}" обновлён на "${updateTaskDto.status}"`,
      );
    }
    return task;
  }
}
