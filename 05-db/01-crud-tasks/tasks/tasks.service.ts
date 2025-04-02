import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "./dto/pagination.dto";
import {
  ERROR_CREATE_TASK_FAILED,
  ERROR_DELETE_TASK_FAILED,
  ERROR_RETRIEVE_TASK_FAILED,
  ERROR_RETRIEVE_TASKS_FAILED,
  ERROR_TASK_NOT_FOUND,
  ERROR_UPDATE_TASK_FAILED,
} from "./tasks.constants";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  public async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const taskRepository = queryRunner.manager.getRepository(Task);
      const newTask = taskRepository.create(createTaskDto);
      const savedTask = await taskRepository.save(newTask);

      await queryRunner.commitTransaction();
      this.logger.log(`Task created: ID ${savedTask.id}`);

      return savedTask;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Error creating task", err.stack);
      throw new HttpException(
        ERROR_CREATE_TASK_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async findAll(paginationDto: PaginationDto): Promise<Task[]> {
    let { page, limit } = paginationDto;
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }

    try {
      const [data, total] = await this.taskRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      });

      this.logger.log(`Retrieved ${data.length} tasks`);
      return data;
    } catch (err) {
      this.logger.error("Error fetching tasks", err.stack);
      throw new HttpException(
        ERROR_RETRIEVE_TASKS_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        this.logger.warn(`Task with ID ${id} not found`);
        throw new HttpException(ERROR_TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Found task: ${task.id}`);
      return task;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(`Error fetching task with ID ${id}`, err.stack);
      throw new HttpException(
        ERROR_RETRIEVE_TASK_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const taskRepository = queryRunner.manager.getRepository(Task);
      const task = await taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new HttpException(ERROR_TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      Object.assign(task, updateTaskDto);
      const updatedTask = await taskRepository.save(task);

      await queryRunner.commitTransaction();
      this.logger.log(`Task updated: ID ${id}`);

      return updatedTask;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating task with ID ${id}`, err.stack);
      throw new HttpException(
        ERROR_UPDATE_TASK_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async remove(id: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const taskRepository = queryRunner.manager.getRepository(Task);
      const task = await taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new HttpException(ERROR_TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      await taskRepository.delete(task.id);
      await queryRunner.commitTransaction();
      this.logger.log(`Task deleted: ${id}`);

      return { message: "Task deleted successfully" };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error deleting task with ID ${id}`, err.stack);
      throw new HttpException(
        ERROR_DELETE_TASK_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
