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
import { CodeCheckRequestDto } from './dto/request/code-check-request.dto';
import { EditPwRequestDto } from './dto/request/edit-pw-request.dto';

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

  @Post('/pw-code')
  pwCode(@Body('email') email: string) {
    return this.userService.pwCode(email);
  }

  @Post('/pw-code-check')
  pwCodeCheck(@Body() codeCheckRequest: CodeCheckRequestDto): Promise<string> {
    return this.userService.pwCodeCheck(codeCheckRequest);
  }

  @Post('/edit-pw')
  editPw(@Body() editPwRequest: EditPwRequestDto): Promise<void> {
    return this.userService.editPw(editPwRequest);
  }
}
