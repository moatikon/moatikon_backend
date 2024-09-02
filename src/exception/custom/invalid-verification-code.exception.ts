import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class InvalidVerificationCodeException extends BaseException {
  constructor() {
    super("유효한 인증코드가 아닙니다.", HttpStatus.BAD_REQUEST);
  }
}
