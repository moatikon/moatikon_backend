import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class ExpiredTokenException extends BaseException {
  constructor() {
    super("만료된 토큰입니다.", HttpStatus.UNAUTHORIZED);
  }
}
