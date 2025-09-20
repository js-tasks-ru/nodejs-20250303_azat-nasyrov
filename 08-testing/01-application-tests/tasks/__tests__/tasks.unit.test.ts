import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

const createTaskDto: CreateTaskDto = {
  title: "New Title",
  description: "New description",
};

const updateTaskDto: UpdateTaskDto = {
  isCompleted: true,
};

describe("TasksService", () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<Task>>;

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const task = { id: 1, ...createTaskDto, isCompleted: false };
      repository.create.mockReturnValue(task as Task);
      repository.save.mockResolvedValue(task as Task);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(task);
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
      expect(repository.save).toHaveBeenCalledWith(task);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const tasks = [{ id: 1, ...createTaskDto, isCompleted: false }];
      repository.find.mockResolvedValue(tasks as Task[]);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      const task = { id: 1, ...createTaskDto, isCompleted: false };
      repository.findOneBy.mockResolvedValue(task as Task);

      const result = await service.findOne(1);

      expect(result).toEqual(task);
    });

    it("should throw NotFoundException when task does not exist", async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const existingTask = { id: 1, ...createTaskDto, isCompleted: false };
      repository.findOneBy.mockResolvedValue(existingTask as Task);
      repository.save.mockResolvedValue({ ...existingTask, ...updateTaskDto });

      const result = await service.update(1, updateTaskDto);

      expect(result.isCompleted).toBe(true);
      expect(repository.save).toHaveBeenCalledWith({
        ...existingTask,
        ...updateTaskDto,
      });
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(99, { isCompleted: true }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      const task = { id: 1, ...createTaskDto, isCompleted: false };
      repository.findOneBy.mockResolvedValue(task as Task);
      repository.remove.mockResolvedValue(task as Task);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(task);
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
