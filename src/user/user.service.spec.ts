import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { TokenService } from 'src/util/token/token.service';
import { MailService } from 'src/util/mail/mail.service';
import { RedisUtilService } from 'src/util/redis/redis-util.service';
import { Repository } from 'typeorm';
import { UserNotFoundException } from 'src/exception/custom/user-not-found.exception';
import * as bcrypt from 'bcrypt';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { NotMatchedPWException } from 'src/exception/custom/not-matched-pw.exception';
import { ConfigService } from '@nestjs/config';
import { InvalidCodeException } from 'src/exception/custom/invalid-code.exception';
import { DuplicateUserException } from 'src/exception/custom/duplicate-user.exception';

describe('User Service', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  let tokenService: TokenService;
  let mailService: MailService;
  let redisService: RedisUtilService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendCodeEmail: jest.fn(),
          },
        },
        {
          provide: RedisUtilService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    tokenService = module.get<TokenService>(TokenService);
    mailService = module.get<MailService>(MailService);
    redisService = module.get<RedisUtilService>(RedisUtilService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should Defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(mailService).toBeDefined();
    expect(redisService).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return a user', async () => {
      const email = 'test-email';
      const hashedPW = 'test-hashed-pw';
      const user = { userid: 1, email, password: hashedPW };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(user as UserEntity);

      const result = await userService.getUserByEmail(email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should throw UserNotFoundException if user is null', () => {
      const email = 'test-email';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = userService.getUserByEmail(email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('hashPW', () => {
    it('should return hashedPw', async () => {
      const password = 'test-pw';
      const salt = 'salt';
      const hashedPW = 'test-hash-pw';

      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => salt);
      jest.spyOn(bcrypt, 'hash').mockImplementation((a, b) => hashedPW);

      const result = await userService.hashPW(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(result).toEqual(hashedPW);
    });
  });

  describe('signup', () => {
    it('should return a user', async () => {
      const email = 'test-email';
      const password = 'test-pw';
      const hashedPW =
        '$2a$10$lv3jihfMMlE8kgnKsPT9QuMm7pyIpcCQpEjkkiLP3UNsX20LY3Fr6';
      const userRequestDto = { email, password };
      const user = { userid: 1, email, password: hashedPW };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(user as UserEntity);
      jest.spyOn(userService, 'hashPW').mockResolvedValue(hashedPW);

      await userService.signup(userRequestDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(userRepository.create).toHaveBeenCalledWith({
        email,
        password: hashedPW,
      });
    });

    it('should throw DuplicateUserException if user is not null', async () => {
      const email = 'test-email';
      const password = 'test-pw';
      const hashedPW = '$2a$10$lv3jihfMMlE8kgnKsPT9QuMm7pyIpcCQpEjkkiLP3UNsX20LY3Fr6';
      const userRequestDto = { email, password };
      const user = { userid: 1, email, password: hashedPW };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as UserEntity);

      const result = userService.signup(userRequestDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).rejects.toThrow(DuplicateUserException);
    });
  });

  describe('signin', () => {
    it('should return access, refresh tokens', async () => {
      const email = 'test-email';
      const password = 'test-pw';
      const hashedPW =
        '$2a$10$lv3jihfMMlE8kgnKsPT9QuMm7pyIpcCQpEjkkiLP3UNsX20LY3Fr6';
      const user = { userid: 1, email, password: hashedPW };
      const accessToken = 'eyadfasdfas';
      const refreshToken = 'eyasbasba';

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(user as UserEntity);
      jest.spyOn(bcrypt, 'compare').mockImplementation((a, b) => true);
      jest
        .spyOn(tokenService, 'generateAccessToken')
        .mockResolvedValue(accessToken);
      jest
        .spyOn(tokenService, 'generateRefreshToken')
        .mockResolvedValue(refreshToken);

      const result = await userService.signin({ email, password });

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(tokenService.generateAccessToken).toHaveBeenLastCalledWith(
        user.userid,
      );
      expect(tokenService.generateRefreshToken).toHaveBeenLastCalledWith(
        user.userid,
      );
      expect(result).toEqual({ accessToken, refreshToken });
    });

    it('should throw NotMatchedPWException if password is not correct', async () => {
      const email = 'test-email';
      const password = 'test-pw';
      const hashedPW =
        '$2a$10$lv3jihfMMlE8kgnKsPT9QuMm7pyIpcCQpEjkkiLP3UNsX20LY3Fr6';
      const user = { userid: 1, email, password: hashedPW };

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(user as UserEntity);
      jest.spyOn(bcrypt, 'compare').mockImplementation((a, b) => false);

      const result = userService.signin({ email, password });

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).rejects.toThrow(NotMatchedPWException);
    });
  });

  describe('reIssue', () => {
    it('should return tokenes', async () => {
      const user = { userid: 1, email: 'email', password: 'hashedPW' };
      const accessToken = 'eyadfasdfas';
      const refreshToken = 'eyasbasba';

      jest
        .spyOn(tokenService, 'generateAccessToken')
        .mockResolvedValue(accessToken);
      jest
        .spyOn(tokenService, 'generateRefreshToken')
        .mockResolvedValue(refreshToken);

      const result = await userService.reIssue(user as UserEntity);

      expect(tokenService.generateAccessToken).toHaveBeenLastCalledWith(
        user.userid,
      );
      expect(tokenService.generateRefreshToken).toHaveBeenLastCalledWith(
        user.userid,
      );
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('generateCode', () => {
    it('should return number code', () => {
      const result = userService.generateCode();
      expect(result.length).toEqual(6);
    });
  });

  describe('pwCode', () => {
    it('should send email', async () => {
      const email = 'test@example.com';
      const mockUser = { email } as UserEntity;
      const code = '123456';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userService, 'generateCode').mockReturnValue(code);
      jest.spyOn(mailService, 'sendCodeEmail').mockResolvedValue(null);
      jest.spyOn(redisService, 'set').mockResolvedValue(null);

      await userService.pwCode(email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(mailService.sendCodeEmail).toHaveBeenCalledWith(email, code);
      expect(redisService.set).toHaveBeenCalledWith(email, code, 600);
    });

    it('should throw UserNotFoundException if a user is null', async () => {
      const email = 'test@example.com';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const result = userService.pwCode(email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('pwCodeCheck', () => {
    it('should return successCode', async () => {
      const email = 'test-email';
      const code = '123456';
      const codeCheckSecret = 'secret';
      const successCode = codeCheckSecret + code;

      jest.spyOn(redisService, 'get').mockResolvedValue(code);
      jest.spyOn(configService, 'get').mockReturnValue(codeCheckSecret);
      jest.spyOn(userService, 'generateCode').mockReturnValue(code);
      jest.spyOn(redisService, 'set').mockResolvedValue(null);

      const result = await userService.pwCodeCheck({ email, code });

      expect(redisService.get).toHaveBeenCalledWith(email);
      expect(configService.get).toHaveBeenCalledWith('CODE_CHECK_SECRET');
      expect(redisService.set).toHaveBeenCalledWith(email, successCode, 6000);
      expect(result).toEqual(successCode);
    });

    it('should throw InvalidCodeException if code is not matched redisCode', async () => {
      const email = 'test-email';
      const code = '123456';

      jest.spyOn(redisService, 'get').mockResolvedValue('654321');

      const result = userService.pwCodeCheck({ email, code });

      expect(redisService.get).toHaveBeenCalledWith(email);
      expect(result).rejects.toThrow(InvalidCodeException);
    });
  });

  describe('editPw', () => {
    it('should update the password if successCode is valid', async () => {
      const email = 'test@example.com';
      const password = 'newPassword123';
      const successCode = 'abcd1234';
      const hashedPw = 'hashedPassword';
      const user = { email, password: 'oldPassword' } as UserEntity;
  
      jest.spyOn(redisService, 'get').mockResolvedValue(successCode);
      jest.spyOn(configService, 'get').mockReturnValue('abcd')
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(userService, 'hashPW').mockResolvedValue(hashedPw);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
  
      const editPwRequest = { email, password, successCode };
  
      await userService.editPw(editPwRequest);
  
      expect(redisService.get).toHaveBeenCalledWith(email);
      expect(userService.hashPW).toHaveBeenCalledWith(password);
      expect(userRepository.save).toHaveBeenCalledWith({ ...user, password: hashedPw });
    });
  
    it('should throw InvalidCodeException if successCode is invalid', async () => {
      const email = 'test@example.com';
      const password = 'newPassword123';
      const successCode = 'invalidSuccessCode';
  
      // Mock Redis service to return a different code
      jest.spyOn(redisService, 'get').mockResolvedValue('differentCode');
  
      const editPwRequest = { email, password, successCode };
  
      await expect(userService.editPw(editPwRequest)).rejects.toThrow(InvalidCodeException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  })
});
