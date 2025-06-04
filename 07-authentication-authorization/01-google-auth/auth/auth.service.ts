import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  public async login(user: User): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      displayName: user.displayName,
      avatar: user.avatar,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
