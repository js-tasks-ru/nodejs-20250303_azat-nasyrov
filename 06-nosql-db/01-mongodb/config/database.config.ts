import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<{ uri: string }> => ({
      uri: getMongoString(configService),
    }),
    inject: [ConfigService],
  };
};

const getMongoString = (configService: ConfigService): string =>
  "mongodb://" +
  configService.get<string>("MONGO_LOGIN") +
  ":" +
  configService.get<string>("MONGO_PASSWORD") +
  "@" +
  configService.get<string>("MONGO_HOST") +
  ":" +
  configService.get<number>("MONGO_PORT") +
  "/" +
  configService.get<string>("MONGO_DATABASE") +
  "?authSource=" +
  configService.get<string>("MONGO_AUTHDATABASE");
