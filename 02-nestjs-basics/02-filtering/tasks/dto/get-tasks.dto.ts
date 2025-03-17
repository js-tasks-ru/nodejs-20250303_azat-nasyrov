import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { TaskSortBy, TaskStatus } from "../task.model";

export class GetTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: "Status must be 'pending', 'in_progress' or 'completed'",
  })
  readonly status?: TaskStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be at least 1" })
  readonly page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  readonly limit?: number;

  @IsOptional()
  @IsEnum(TaskSortBy, { message: "SortBy must be 'title' or 'status'" })
  readonly sortBy?: TaskSortBy;
}
