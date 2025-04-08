import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    imports: [ConfigModule],
    useFactory: async (
      configService: ConfigService,
    ): Promise<{ uri: string }> => ({
      uri: getMongoUri(configService),
    }),
    inject: [ConfigService],
  };
};

const getMongoUri = (configService: ConfigService): string => {
  const login = configService.get<string>("MONGO_LOGIN") || "";
  const password = configService.get<string>("MONGO_PASSWORD") || "";
  const host = configService.get<string>("MONGO_HOST") || "127.0.0.1";
  const port = configService.get<number>("MONGO_PORT") || "27017";
  const database = configService.get<string>("MONGO_DATABASE") || "test";
  const authDatabase = configService.get<string>("MONGO_AUTHDATABASE") || "admin";

  const credentials = login && password ? `${login}:${password}@` : "";

  return `mongodb://${credentials}${host}:${port}/${database}?authSource=${authDatabase}`
};
