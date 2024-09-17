import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class JobNotFoundException extends BaseException {
  constructor() {
    super('해당 이름의 스캐줄이 존재하지 않아요.', HttpStatus.CONFLICT);
  }
}
