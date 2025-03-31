import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userRole = request.headers["x-role"]?.toString().toLowerCase();

    if (userRole !== "admin") {
      throw new ForbiddenException(
        "Доступ запрещён: требуется роль admin",
      );
    }

    return true;
  }
}
