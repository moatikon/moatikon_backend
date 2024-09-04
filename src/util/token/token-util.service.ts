import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

@Injectable()
export class TokenUtilService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  generateAccessToken(userid: number, email: string): string {
    const payload = { userid, email };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userid: number): string {
    const payload: object = { userid };
    const jwtSignOption: JwtSignOptions = {
      secret: this.configService.get<string>("JWT_RE_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXE"),
    };

    return this.jwtService.sign(payload, jwtSignOption);
  }
}