import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "./task.model";
import { ParseIntPipe } from "../pipes/parse-int.pipe";
import { RolesGuard } from "../guards/roles.guard";
import { ApiVersionInterceptor } from "../interceptors/api-version.interceptor";
import { HttpErrorFilter } from "../filters/http-error.filter";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseInterceptors(ApiVersionInterceptor)
  @UseFilters(HttpErrorFilter)
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get(":id")
  @UseInterceptors(ApiVersionInterceptor)
  @UsePipes()
  @UseFilters(HttpErrorFilter)
  getTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @UseInterceptors(ApiVersionInterceptor)
  @UseFilters(HttpErrorFilter)
  createTask(@Body() task: CreateTaskDto) {
    return this.tasksService.createTask(task);
  }

  @Patch(":id")
  @UseInterceptors(ApiVersionInterceptor)
  @UsePipes()
  @UseFilters(HttpErrorFilter)
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, task);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @UseInterceptors(ApiVersionInterceptor)
  @UsePipes()
  @UseFilters(HttpErrorFilter)
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
