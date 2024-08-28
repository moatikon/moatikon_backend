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

    if (user) throw new BadRequestException("이미 사용하고 있는 유저입니다.");

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

    throw new UnauthorizedException(
      "등록되지 않은 이메일이거나 비밀번호를 잘못 입력했습니다."
    );
  }
}
