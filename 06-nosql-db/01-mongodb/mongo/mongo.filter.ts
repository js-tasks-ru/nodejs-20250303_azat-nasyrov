import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  public catch(
    exception: any,
    host: ArgumentsHost,
  ): Response<any, Record<string, any>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof mongoose.Error.ValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        error: "Bad Request",
        message: exception.message || "Validation error",
      });
    }

    if (
      exception.code === 11000 ||
      exception instanceof mongoose.mongo.MongoError
    ) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        error: "Bad Request",
        message: exception.message || "MongoDB error",
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Unexpected MongoDB error",
    });
  }
}
