import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TasksModule } from "./tasks/tasks.module";
import { getMongoConfig } from "./config/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    TasksModule,
  ],
})
export class AppModule {}
