import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRequestDto } from "./dto/request/user-request.dto";

@Controller("auth")
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/signup")
  signup(@Body() userRequestDto: UserRequestDto): Promise<void> {
    return this.userService.signup(userRequestDto);
  }
}
