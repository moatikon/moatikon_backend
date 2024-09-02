import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { TokenUtilService } from "src/util/token/token-util.service";
import { UserRequestDto } from "./dto/request/user-request.dto";

import * as bcrypt from "bcryptjs";
import { TokenResponseDto } from "./dto/response/token-response.dto";
import { DuplicationUserException } from "src/exception/custom/duplication-user.exception";
import { LoginFailException } from "src/exception/custom/login-fail.exception";
import { EmailUtilService } from "src/util/email/email-util-service";
import { NotFoundUserException } from "src/exception/custom/not-found-user.exception";
import { RedisUtilService } from "src/util/redis/redis-util.service";
import { addMinutes, format } from "date-fns";
import { PwCodeCheckDto } from "./dto/request/pw-code-check.dto";
import { InvalidVerificationCodeException } from "src/exception/custom/invalid-verification-code.exception";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenUtil: TokenUtilService,
    private emailUtil: EmailUtilService,
    private redieUtil: RedisUtilService
  ) {}

  async #generateHashPw(password: string):Promise<string>{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async signup(userRequestDto: UserRequestDto): Promise<void> {
    const { email, password } = userRequestDto;
    let user: UserEntity = await this.userRepository.findOneBy({ email });

    if (user) throw new DuplicationUserException();

    const hashedPassword = await this.#generateHashPw(password);

    user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
  }

  async signin(userRequestDto: UserRequestDto): Promise<TokenResponseDto> {
    const { email, password } = userRequestDto;
    let user: UserEntity = await this.userRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken: string = this.tokenUtil.generateAccessToken(
        user.userid,
        user.email
      );
      const refreshToken: string = this.tokenUtil.generateRefreshToken(
        user.userid
      );

      return new TokenResponseDto(accessToken, refreshToken);
    }

    throw new LoginFailException();
  }

  async reissue(userParam: UserEntity): Promise<TokenResponseDto> {
    const { userid, email } = userParam;

    const accessToken: string = this.tokenUtil.generateAccessToken(
      userid,
      email
    );
    const refreshToken: string = this.tokenUtil.generateRefreshToken(userid);

    return new TokenResponseDto(accessToken, refreshToken);
  }

  async pwCode(email: string): Promise<void> {
    const user: UserEntity = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundUserException();

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.emailUtil.sendEmail(user.email, code);
    await this.redieUtil.set(
      user.email,
      JSON.stringify({
        code: code,
        ttl: addMinutes(Date.now(), 1).toISOString(),
      })
    );
  }

  async pwCodeCheck(pwCodeCheckDto: PwCodeCheckDto): Promise<void>{
    const {email, code, password} = pwCodeCheckDto;

    const redisCode = await this.redieUtil.get(email);
    if(!redisCode) throw new NotFoundUserException();

    const parseRedisCode = JSON.parse(redisCode);
    
    if (parseRedisCode.code !== code || new Date() > new Date(parseRedisCode.ttl))
      throw new InvalidVerificationCodeException();

    const user: UserEntity = await this.userRepository.findOneBy({ email });
    user.password = await this.#generateHashPw(password);
    await this.userRepository.save(user);
  }
}
