export class TokenResponseDto {
  accessToken: string;
  reffreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.reffreshToken = refreshToken;
  }
}
