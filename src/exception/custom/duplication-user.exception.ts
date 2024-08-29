import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../base.exception";

export class DuplicationUserException extends BaseException {
  constructor(){
    super("이미 존재하는 유저입니다.", HttpStatus.CONFLICT)
  }
}