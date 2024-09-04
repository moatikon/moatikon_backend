import { ExecutionContext } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExpiredTokenException } from 'src/exception/custom/expired-token.exception';
import { InvalidTokenException } from 'src/exception/custom/invalid-token.exception';

export class AuthAccessGuard extends AuthGuard('refresh') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new ExpiredTokenException();
      } else {
        throw new InvalidTokenException();
      }
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
