import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      await repository.save({ title: "One", description: "First" });
      await repository.save({ title: "Two", description: "Second" });

      const response = await request(app.getHttpServer())
        .get("/tasks")
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const task = await repository.save({ title: "One", description: "First" });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.title).toBe("One");
    });

    it("should return 404 if task not found", async () => {
      await request(app.getHttpServer()).get("/tasks/999").expect(404);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app.getHttpServer())
        .post("/tasks")
        .send({ title: "Test", description: "Desc" })
        .expect(201);

      expect(response.body.title).toBe("Test");
      expect(response.body.description).toBe("Desc");

      const tasks = await repository.find();
      expect(tasks).toHaveLength(1);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      const task = await repository.save({ title: "Old", description: "Desc" });

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({ isCompleted: true })
        .expect(200);

      expect(response.body.isCompleted).toBe(true);

      const updated = await repository.findOneBy({ id: task.id });
      expect(updated.isCompleted).toBe(true);
    });

    it("should return 404 when updating non-existent task", async () => {
      await request(app.getHttpServer())
        .patch("/tasks/999")
        .send({ isCompleted: true })
        .expect(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      const task = await repository.save({ title: "Delete", description: "Me" });

      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(200);

      const tasks = await repository.find();
      expect(tasks).toHaveLength(0);
    });

    it("should return 404 when deleting non-existent task", async () => {
      await request(app.getHttpServer()).delete("/tasks/999").expect(404);
    });
  });
});
