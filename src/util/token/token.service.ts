import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(userid: number): Promise<string> {
    const payload = { userid };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(userid: number): Promise<string> {
    const payload = { userid };
    const option: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_RE_SECRET'),
      expiresIn: this.configService.get<string>('JWT_RE_EXE'),
    };

    console.log(this.configService.get<string>('JWT_RE_SECRET'));
    

    return this.jwtService.sign(payload, option);
  }
}
