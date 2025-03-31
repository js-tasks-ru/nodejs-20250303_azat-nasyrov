import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class ApiVersionInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const start = Date.now();
    return next
      .handle()
      .pipe(
        tap((response) => {
          const executionTime = Date.now() - start;
          response.apiVersion = "1.0";
          response.executionTime = `${executionTime}ms`;
        }),
      );
  }
}
