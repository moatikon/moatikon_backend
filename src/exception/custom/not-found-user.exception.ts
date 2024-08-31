import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class NotFoundUserException extends BaseException {
  constructor() {
    super("존재하지 않는 유저입니다.", HttpStatus.NOT_FOUND);
  }
}
