import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const startRequestTime = Date.now();
    const requestMethod = req.method;
    const requestPath = req.url;

    res.on("finish", () => {
      const endRequestTime = Date.now();
      const executionTime = endRequestTime - startRequestTime;

      console.log(`[${requestMethod}] ${requestPath} - ${executionTime}ms`);
    });

    next();
  }
}
