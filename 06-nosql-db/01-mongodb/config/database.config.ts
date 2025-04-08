import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    imports: [ConfigModule],
    useFactory: async (
      configService: ConfigService,
    ): Promise<{ uri: string }> => ({
      uri: getMongoString(configService),
    }),
    inject: [ConfigService],
  };
};

const getMongoString = (configService: ConfigService): string =>
  "mongodb://" +
  (configService.get<string>("MONGO_LOGIN") || "") +
  ":" +
  (configService.get<string>("MONGO_PASSWORD") || "") +
  "@" +
  (configService.get<string>("MONGO_HOST") || "127.0.0.1") +
  ":" +
  (configService.get<string>("MONGO_PORT") || 27017) +
  "/" +
  (configService.get<string>("MONGO_DATABASE") || "test") +
  "?authSource=" +
  (configService.get<string>("MONGO_AUTHDATABASE") || "admin");
