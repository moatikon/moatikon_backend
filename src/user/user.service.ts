import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { TokenUtilService } from "src/util/token/token-util.service";
import { UserRequestDto } from "./dto/request/user-request.dto";

import * as bcrypt from "bcryptjs";
import { TokenResponseDto } from "./dto/response/token-response.dto";
import { DuplicationUserException } from "src/exception/custom/duplication-user.exception";
import { LoginFailException } from "src/exception/custom/login-fail.exception";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenUtil: TokenUtilService
  ) {}

  async signup(userRequestDto: UserRequestDto): Promise<void> {
    const { email, password } = userRequestDto;
    let user: UserEntity = await this.userRepository.findOneBy({ email });

    if (user) throw new DuplicationUserException();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

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
}
