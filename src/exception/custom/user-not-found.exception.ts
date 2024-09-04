import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class UserNotFoundException extends BaseException {
  constructor() {
    super('해당 유저는 존재하지 않습니다.', HttpStatus.NOT_FOUND);
  }
}
