import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserReqeustDto } from './dto/request/user-request.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async #hashPW(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    const hashedPW: string = await bcrypt.hash(password, salt);
    return hashedPW;
  }

  async signUp(userReqeust: UserReqeustDto): Promise<void> {
    const { email, password } = userReqeust;

    const user: UserEntity = await this.userRepository.findOneBy({ email });
    if (user) throw new BadRequestException();

    const hashedPW = await this.#hashPW(password);
    const userEntity: UserEntity = this.userRepository.create({
      userid: null,
      email,
      password: hashedPW,
    });

    await this.userRepository.save(userEntity);
  }
}
