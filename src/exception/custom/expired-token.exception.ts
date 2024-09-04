import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class ExpiredTokenException extends BaseException {
  constructor() {
    super('보내준 토큰은 만료된 토큰이예요.', HttpStatus.UNAUTHORIZED);
  }
}
