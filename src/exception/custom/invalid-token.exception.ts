import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class InvalidTokenException extends BaseException {
  constructor() {
    super('유효하지 않은 토큰 양식입니다.', HttpStatus.UNAUTHORIZED);
  }
}
