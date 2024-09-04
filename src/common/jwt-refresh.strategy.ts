import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UserEntity } from "src/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => req.headers["re-token"],
      secretOrKey: configService.get<string>("JWT_RE_SECRET"),
    });
  }

  async validate(payload): Promise<UserEntity> {
    const { userid } = payload;
    const user: UserEntity = await this.userRepository.findOneBy({ userid });

    if (!user) throw new NotFoundException("존재하지 않는 유저입니다.");

    return user;
  }
}
