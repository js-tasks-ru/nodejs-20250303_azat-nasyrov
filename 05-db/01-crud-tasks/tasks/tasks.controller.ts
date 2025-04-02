import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "./dto/pagination.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  public async findAll(@Query() paginationDto: PaginationDto): Promise<Task[]> {
    return await this.tasksService.findAll(paginationDto);
  }

  @Get(":id")
  public async findOne(@Param("id", ParseIntPipe) id: number): Promise<Task> {
    return await this.tasksService.findOne(id);
  }

  @Patch(":id")
  public async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  public async remove(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return await this.tasksService.remove(id);
  }
}
