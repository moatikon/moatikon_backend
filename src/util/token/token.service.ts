import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(userid: number): Promise<string> {
    const payload = { userid };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(userid: number): Promise<string> {
    const payload = {userid};
    const option: JwtSignOptions = { secret: process.env.JWT_RE_SECRET, expiresIn: process.env.JWT_RE_EXE };
    return this.jwtService.sign(payload, option);
  }
}
