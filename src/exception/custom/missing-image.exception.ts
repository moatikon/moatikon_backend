import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../base.exception';

export class MissingImageException extends BaseException {
  constructor() {
    super('이미지를 추가해주세요', HttpStatus.BAD_REQUEST);
  }
}
