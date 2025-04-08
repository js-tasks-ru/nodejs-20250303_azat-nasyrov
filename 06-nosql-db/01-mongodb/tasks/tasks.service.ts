import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  public async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const createdTask = new this.taskModel(createTaskDto);
    const savedTask = await createdTask.save();
    this.logger.log(`Task created: ${savedTask._id}`);
    return savedTask;
  }

  public async findAll(): Promise<TaskDocument[]> {
    const tasks = await this.taskModel.find().exec();
    this.logger.log(`Fetched tasks: ${tasks.length} tasks`);
    return tasks;
  }

  public async findOne(id: ObjectId): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      this.logger.warn(`Task with ID: ${id} not found`);
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Fetched task: ID ${id}`);
    return task;
  }

  public async update(
    id: ObjectId,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedTask) {
      this.logger.warn(`Task with ID: ${id} not found`);
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Task updated: ID ${id}`);
    return updatedTask;
  }

  public async remove(id: ObjectId): Promise<TaskDocument> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      this.logger.warn(`Task with ID: ${id} not found`);
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Task deleted: ID ${id}`);
    return deletedTask;
  }
}
