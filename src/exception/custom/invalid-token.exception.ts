import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class InvalidTokenException extends BaseException {
  constructor() {
    super("잘못된 토큰 형식 입니다.", HttpStatus.BAD_REQUEST);
  }
}
