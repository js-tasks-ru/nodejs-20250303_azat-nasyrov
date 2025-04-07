import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongoose";
import { TasksService } from "./tasks.service";
import { TaskDocument } from "./schemas/task.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ObjectIDPipe } from "../objectid/objectid.pipe";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  public async create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskDocument> {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  public async findAll(): Promise<TaskDocument[]> {
    return await this.tasksService.findAll();
  }

  @Get(":id")
  public async findOne(
    @Param("id", ObjectIDPipe) id: ObjectId,
  ): Promise<TaskDocument> {
    return await this.tasksService.findOne(id);
  }

  @Patch(":id")
  public async update(
    @Param("id", ObjectIDPipe) id: ObjectId,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  public async remove(
    @Param("id", ObjectIDPipe) id: ObjectId,
  ): Promise<TaskDocument> {
    return await this.tasksService.remove(id);
  }
}
