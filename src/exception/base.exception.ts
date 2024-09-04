import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(message: string, state: number) {
    super({ message: [message] }, state);

    this.message = message;
    this.state = state;
  }

  message: string;
  state: number;
}
