import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserReqeustDto } from './dto/request/user-request.dto';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { AuthRefreshGuard } from 'src/common/guard/auth-refresh.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserEntity } from './user.entity';

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

  @Get('/re-issue')
  @UseGuards(AuthRefreshGuard)
  reIssue(@GetUser() user: UserEntity): Promise<TokenResponseDto> {
    return this.userService.reIssue(user);
  }
}
