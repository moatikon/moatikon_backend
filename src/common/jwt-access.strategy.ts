import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Request Header에서 Bearer auth 뽑아내기
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload): Promise<UserEntity> {
    const { userid } = payload;
    const user: UserEntity = await this.userRepository.findOneBy({ userid });

    if(!user) throw new NotFoundException("존재하지 않는 유저입니다.");

    return user;
  }
}
