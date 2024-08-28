import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UserEntity } from "src/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";

import * as config from "config";
const jwtConfig = config.get("jwt");

export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: (req) => req.headers["RE-TOKEN"],
      secretOrKey: jwtConfig.re_secret,
    });
  }

  async validate(payload): Promise<UserEntity> {
    const { userid } = payload;

    const user: UserEntity = await this.userRepository.findOneBy({ userid });
    return user;
  }
}
