import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./guards/jwt.guard";
import { AuthGuard } from "@nestjs/passport";
import { Public } from "./decorators/public.decorator";
import { RequestWithUserInterface } from "./types/express-request-with-user.interface";
import { JwtPayloadInterface } from "./types/jwt-payload.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  public google(): string {
    return "ok";
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  public async googleCallback(@Request() req): Promise<string> {
    const result = await this.authService.login(req.user);

    // Return an HTML payload that:
    // 1) Displays a message,
    // 2) Stores the token in localStorage,
    // 3) Redirects to /auth/profile.
    return `
    <html>
      <head>
        <title>Login Callback</title>
      </head>
      <body>
        <p>wait until login is complete</p>
        <script>
          localStorage.setItem('token', '${result.accessToken}');
          window.location.href = '/';
        </script>
      </body>
    </html>
  `;
  }

  @Get("profile")
  @UseGuards(JwtGuard)
  public profile(@Request() request: RequestWithUserInterface): JwtPayloadInterface {
    return request.user;
  }
}
