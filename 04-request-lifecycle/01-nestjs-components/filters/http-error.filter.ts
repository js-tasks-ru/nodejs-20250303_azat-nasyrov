import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as fs from "fs";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message = this.extractMessage(exception);

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${status} - ${message}\n`;
    fs.appendFileSync("errors.log", logMessage);

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: timestamp,
    });

    this.logger.error(message);
  }

  private extractMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === "string") {
        return response;
      } else if (typeof response === "object" && response["message"]) {
        return Array.isArray(response["message"])
          ? response["message"].join(", ")
          : response["message"];
      }
    }

    return "Unknown error";
  }
}
