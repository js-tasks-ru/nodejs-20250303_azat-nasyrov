import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.model";
import { GetTasksDto } from "./dto/get-tasks.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  public getTasks(@Query() getTaskDto: GetTasksDto): Task[] {
    return this.tasksService.getFilteredTasks(getTaskDto);
  }
}
