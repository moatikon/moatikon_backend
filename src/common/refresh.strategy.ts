import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-jwt';
import { UserNotFoundException } from 'src/exception/custom/user-not-found.exception';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: process.env.JWT_RE_SECRET,
      jwtFromRequest: (req) => req.headers['re-token'],
    });
  }

  async validate(payload): Promise<UserEntity> {
    const { userid } = payload;
    const user: UserEntity = await this.userRepository.findOneBy({ userid });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
