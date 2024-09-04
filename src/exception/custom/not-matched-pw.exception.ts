import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class NotMatchedPWException extends BaseException {
  constructor() {
    super('비밀번호가 맞지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
