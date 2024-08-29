import { HttpStatus } from "@nestjs/common"
import { BaseException } from "../base.exception"

export class NotPostOwnerException extends BaseException{
  constructor(){
    super("해당 유저가 가지지 못한 권한입니다.", HttpStatus.FORBIDDEN)
  }
}