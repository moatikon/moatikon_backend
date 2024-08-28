import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import * as config from "config";
const jwtConfig = config.get("jwt");

@Injectable()
export class TokenUtilService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(userid: number, email: string): string {
    const payload: object = { userid, email };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userid: number): string {
    const payload: object = { userid };
    const jwtSignOption: JwtSignOptions = {
      secret: jwtConfig.re_secret,
      expiresIn: jwtConfig.refresh_expiresIn,
    };

    return this.jwtService.sign(payload, jwtSignOption);
  }
}