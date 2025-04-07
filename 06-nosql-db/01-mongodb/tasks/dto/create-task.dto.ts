import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty({ message: "Title is required" })
  @IsString()
  @MinLength(3, { message: "Title must be at least 3 characters" })
  @MaxLength(100, { message: "Title must be at most 100 characters" })
  readonly title: string;

  @IsNotEmpty({ message: "Description is required" })
  @IsString()
  @MaxLength(500, { message: "Description must be at most 500 characters" })
  readonly description: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isCompleted: boolean = false;

  @IsOptional()
  @IsDate()
  readonly deadline?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  readonly priority?: number;
}
