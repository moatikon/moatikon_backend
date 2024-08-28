import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRequestDto } from "./dto/request/user-request.dto";
import { TokenResponseDto } from "./dto/response/token-response.dto";

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
}
