import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import database from "./tasks/config/database";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
    }),
    TypeOrmModule.forRootAsync(database.asProvider()),
    TasksModule
  ],
})
export class AppModule {}
