import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class LoginFailException extends BaseException {
  constructor() {
    super(
      "등록되지 않은 이메일이거나 비밀번호를 잘못 입력했습니다.",
      HttpStatus.UNAUTHORIZED
    );
  }
}
