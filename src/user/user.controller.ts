import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRequestDto } from "./dto/request/user-request.dto";
import { TokenResponseDto } from "./dto/response/token-response.dto";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { UserEntity } from "./user.entity";
import { AuthRefreshGuard } from "src/common/guard/auth-refresh.guard";

@Controller("auth")
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/signup")
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() userRequestDto: UserRequestDto): Promise<void> {
    return this.userService.signup(userRequestDto);
  }

  @Post("/signin")
  @HttpCode(HttpStatus.OK)
  signin(@Body() userRequestDto: UserRequestDto): Promise<TokenResponseDto> {
    return this.userService.signin(userRequestDto);
  }

  @Get("/re-issue")
  @UseGuards(AuthRefreshGuard)
  @HttpCode(HttpStatus.OK)
  reissue(@GetUser() user: UserEntity): Promise<TokenResponseDto> {
    return this.userService.reissue(user);
  }

  @Post("/pw-code")
  pwCode(@Body("email") email: string): Promise<void> {    
    return this.userService.pwCode(email);
  }
}
