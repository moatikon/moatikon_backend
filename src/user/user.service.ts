import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { TokenUtilService } from "src/util/token/token-util.service";
import { UserRequestDto } from "./dto/request/user-request.dto";

import * as bcrypt from "bcryptjs";

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

    if (user) {
      throw new BadRequestException("이미 사용하고 있는 유저입니다.");
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      user = this.userRepository.create({
        email,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
    }
  }
}
