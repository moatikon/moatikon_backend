import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('Token Service', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          }
        }
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should Defined tokenService and jwtService', () => {
    expect(tokenService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generateAccessToken', async () => {
      const userid = 1;
      const accessToken = 'eyadfasd';
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await tokenService.generateAccessToken(userid);

      expect(jwtService.sign).toHaveBeenCalledWith({ userid });
      expect(result).toEqual(accessToken);
    })
  });

  describe('generateRefreshToken', () => {
    it('should generateRefreshToken', async () => {
      const userid = 1;
      const secret = 'secret';
      const expiresIn = 'expiresIn';
      const option = { secret, expiresIn };
      const refreshToken = 'eyadfasd';

      jest.spyOn(jwtService, 'sign').mockReturnValue(refreshToken);
      jest.spyOn(configService, 'get').mockReturnValueOnce(secret);
      jest.spyOn(configService, 'get').mockReturnValueOnce(expiresIn);
      const result = await tokenService.generateRefreshToken(userid);

      expect(configService.get).toHaveBeenNthCalledWith(1, 'JWT_RE_SECRET');
      expect(configService.get).toHaveBeenNthCalledWith(2, 'JWT_RE_EXE');
      expect(jwtService.sign).toHaveBeenCalledWith({ userid }, option);
      expect(result).toEqual(refreshToken);
    })
  });
});
