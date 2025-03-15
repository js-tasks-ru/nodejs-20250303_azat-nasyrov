# Управление уведомлениями при работе с задачами на NestJS (Решение)

---

В этом решении мы реализуем функционал отправки **Email** и **SMS-уведомлений** при создании и обновлении задач с
использованием **NotificationService**.

Реализация включает:

1. Сервис для управления бизнес-логикой задач и вызова уведомлений (`TasksService`).
2. Сервис для уведомлений (отправки писем и смс) `NotificationService`.

---

## **Сервис `NotificationService`**

Сервис содержит методы для отправки **Email** и **SMS** уведомлений. В данном решении методы логируют сообщения в консоль.

```typescript
@Injectable()
export class NotificationService {
  async sendEmail(to: string, subject: string, message: string) {
    console.log(`Email sent to ${to}: [${subject}] ${message}`);
  }

  async sendSMS(to: string, message: string): Promise<void> {
    console.log(`SMS sent to ${to}: ${message}`);
  }
}
```

---

## **Сервис `TasksService`**

Сервис управляет бизнес-логикой и вызывает `NotificationService` для отправки уведомлений.

### **Создание задачи**

Метод создает задачу, вызывает `NotificationService.sendEmail` и добавляет задачу в массив.

```typescript
async createTask(createTaskDto: CreateTaskDto) {
  ...

  await this.notificationsService.sendEmail(
    user.email,
    "Новая задача",
    `Вы назначены ответственным за задачу: "${task.title}"`,
  );

  return task;
}
```

### **Обновление задачи**

Метод обновляет статус задачи и вызывает `NotificationService.sendSMS`.

```typescript
async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
  ...

  await this.notificationsService.sendSMS(
    user.phone,
    `Статус задачи "${task.title}" обновлён на "${task.status}"`,
  );

  return task;
}
```

---

## **Особенности решения**

1. **Разделение логики**:
   - `TasksController` обрабатывает HTTP-запросы.
   - `TasksService` управляет логикой и вызывает `NotificationService`.
