import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class UnableToCompleteTikonException extends BaseException {
  constructor() {
    super(
      '존재하지 않는 티콘이거나 해당유저가 할 수 있는 권한이 아닙니다.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
