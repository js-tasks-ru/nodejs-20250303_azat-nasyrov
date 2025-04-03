import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty({ message: "The title must not be empty" })
  @IsString()
  readonly title: string;

  @IsNotEmpty({ message: "Description must not be empty" })
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isCompleted: boolean = false;
}
