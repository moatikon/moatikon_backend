import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class SendEmailException extends BaseException {
  constructor() {
    super("이메일 보내기에 실패했어요", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
