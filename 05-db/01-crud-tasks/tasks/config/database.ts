import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: "sqlite",
    database: "./tasks-db.sqlite",
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  } as TypeOrmModuleOptions;
});
