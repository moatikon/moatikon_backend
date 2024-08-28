import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { jwtRefreshExe, jwtReSecret } from "src/configs/configs";

@Injectable()
export class TokenUtilService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(userid: number, email: string): string {
    const payload = { userid, email };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userid: number): string {
    const payload: object = { userid };
    const jwtSignOption: JwtSignOptions = {
      secret: jwtReSecret,
      expiresIn: jwtRefreshExe,
    };

    return this.jwtService.sign(payload, jwtSignOption);
  }
}
