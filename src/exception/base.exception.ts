import { HttpException } from "@nestjs/common";

export class BaseException extends HttpException {
  constructor(message: string, statusCode: number) {
    super({
      message: [message]
    }, statusCode);

    this.message = message;
    this.statusCode = statusCode;
  }

  message: string;
  statusCode: number;
}
