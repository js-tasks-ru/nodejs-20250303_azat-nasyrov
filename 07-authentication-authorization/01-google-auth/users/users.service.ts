import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findOne(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  public async create(payload: Partial<User>): Promise<User> {
    const user = new User();
    user.id = payload.id;
    user.displayName = payload.displayName;
    user.avatar = payload.avatar;

    return await this.userRepository.save(user);
  }
}
