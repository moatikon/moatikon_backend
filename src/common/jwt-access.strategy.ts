import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import * as config from 'config';
const jwtConfig = config.get('jwt');

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Request Header에서 Bearer auth 뽑아내기
      secretOrKey: jwtConfig.secret,
    });
  }

  validate(payload) {
    const {userid, email} = payload;
    return { userid, email };
  }
}