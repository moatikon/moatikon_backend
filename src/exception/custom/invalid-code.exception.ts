import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class InvalidCodeException extends BaseException {
  constructor() {
    super('일치하지 않는 코드입니다.', HttpStatus.BAD_REQUEST);
  }
}
