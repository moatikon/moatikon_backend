import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserReqeustDto } from './dto/request/user-request.dto';
import * as bcrypt from 'bcryptjs';
import { DuplicateUserException } from 'src/exception/custom/duplicate-user.exception';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { UserNotFoundException } from 'src/exception/custom/user-not-found.exception';
import { NotMatchedPWException } from 'src/exception/custom/not-matched-pw.exception';
import { TokenService } from 'src/util/token/token.service';
import { MailService } from 'src/util/mail/mail.service';
import { RedisUtilService } from 'src/util/redis/redis-util.service';
import { InvalidCodeException } from 'src/exception/custom/invalid-code.exception';
import { CodeCheckRequestDto } from './dto/request/code-check-request.dto';
import { EditPwRequestDto } from './dto/request/edit-pw-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenService: TokenService,
    private mailService: MailService,
    private redisService: RedisUtilService,
  ) {}

  async #getUserByEmail(email: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOneBy({ email });
    if (!user) throw new UserNotFoundException();

    return user;
  }

  async #hashPW(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    const hashedPW: string = await bcrypt.hash(password, salt);
    return hashedPW;
  }

  async signup(userReqeust: UserReqeustDto): Promise<void> {
    const { email, password }: UserReqeustDto = userReqeust;

    const user: UserEntity = await this.userRepository.findOneBy({ email });
    if (user) throw new DuplicateUserException();

    const hashedPW = await this.#hashPW(password);
    const userEntity: UserEntity = this.userRepository.create({
      userid: null, email, password: hashedPW,
    });

    await this.userRepository.save(userEntity);
  }

  async signin(userRequest: UserReqeustDto): Promise<TokenResponseDto> {
    const { email, password }: UserReqeustDto = userRequest;
    const user: UserEntity = await this.#getUserByEmail(email);

    if (!(await bcrypt.compare(password, user.password))) throw new NotMatchedPWException();

    const accessToken: string = await this.tokenService.generateAccessToken( user.userid );
    const refreshToken: string = await this.tokenService.generateRefreshToken( user.userid );
    return new TokenResponseDto(accessToken, refreshToken);
  }

  async reIssue(userEntity: UserEntity): Promise<TokenResponseDto> {
    const { userid }: UserEntity = userEntity;
    const accessToken: string =
      await this.tokenService.generateAccessToken(userid);
    const refreshToken: string =
      await this.tokenService.generateRefreshToken(userid);

    return new TokenResponseDto(accessToken, refreshToken);
  }

  #generateCode(): string {
    const numCode = Math.floor(Math.random() * 1000000);
    const code = String(numCode).padStart(6, '0');
    return code;
  }

  async pwCode(email: string): Promise<void> {
    await this.#getUserByEmail(email);
    const code: string = this.#generateCode();

    await this.mailService.sendCodeEmail(email, code);
    await this.redisService.set(email, code, 600);
  }

  async pwCodeCheck(codeCheckRequest: CodeCheckRequestDto): Promise<string> {
    const { email, code } = codeCheckRequest;
    const redisCode: string = await this.redisService.get(email);

    if (code == redisCode) {
      const successCode = process.env.CODE_CHECK_SECRET + this.#generateCode();
      console.log(successCode);
      await this.redisService.set(email, successCode, 6000);
      return successCode;
    } else {
      throw new InvalidCodeException();
    }
  }

  async editPw(editPwRequest: EditPwRequestDto): Promise<void> {
    const { email, password, successCode } = editPwRequest;

    const redisCode: string = await this.redisService.get(email);

    if (
      successCode == redisCode &&
      redisCode.includes(process.env.CODE_CHECK_SECRET)
    ) {
      let user: UserEntity = await this.#getUserByEmail(email);
      user.password = await this.#hashPW(password);
      await this.userRepository.save(user);
    } else {
      throw new InvalidCodeException();
    }
  }
}
