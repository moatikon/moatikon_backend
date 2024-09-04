import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserReqeustDto } from './dto/request/user-request.dto';
import { TokenResponseDto } from './dto/response/token-response.dto';

@Controller('auth')
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signup(@Body() userReqeust: UserReqeustDto): Promise<void> {
    return this.userService.signup(userReqeust);
  }

  @Post('/signin')
  signin(@Body() userReqeust: UserReqeustDto): Promise<TokenResponseDto> {
    return this.userService.signin(userReqeust);
  }
}
