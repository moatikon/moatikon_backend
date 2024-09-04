import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserReqeustDto } from './dto/request/user-request.dto';

@Controller('auth')
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signUp(@Body() userReqeust: UserReqeustDto): Promise<void> {
    return this.userService.signUp(userReqeust);
  }
}