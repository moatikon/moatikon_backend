import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class DuplicateUserException extends BaseException {
  constructor() {
    super('이미 같은 이메일의 유저가 존재합니다.', HttpStatus.CONFLICT);
  }
}
