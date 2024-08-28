import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

import * as config from "config";
const jwtConfig = config.get("jwt");

export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor() {
    super({
      jwtFromRequest: (req) => req.headers["RE-TOKEN"],
      secretOrKey: jwtConfig.re_secret,
    });
  }

  validate(payload) {
    const { userid } = payload;
    return { userid };
  }
}
