import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TaskStatus } from "../task.model";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus, { message: "Status must be 'pending', 'in_progress' or 'completed'" })
  readonly status: TaskStatus;
}
