import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>("oauth.google.clientID"),
      clientSecret: configService.get<string>("oauth.google.clientSecret"),
      callbackURL: configService.get<string>("oauth.google.callbackURL"),
      scope: ["profile", "email"],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    let user = await this.usersService.findOne(profile.id);
    if (!user) {
      user = await this.usersService.create({
        id: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value ?? "",
      });
    }

    return user;
  }
}
