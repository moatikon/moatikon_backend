import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TikonService } from "./tikon.service";
import { CreateTikonDto } from "./dto/create-tikon.dto";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { UserEntity } from "src/user/user.entity";
import { AuthAccessGuard } from "src/common/guard/auth-access.guard";
import { TikonEntity } from "./tikon.entity";
import { ImageInterceptor } from "../common/interceptor/image.interceptor";
import { TikonResponseDto } from "./dto/tikon-response.dto";

@Controller("tikon")
@UsePipes(ValidationPipe)
@UseGuards(AuthAccessGuard)
export class TikonController {
  constructor(private tikonService: TikonService) {}

  @Get()
  getAllMyTikons(@GetUser() user: UserEntity): Promise<TikonResponseDto> {
    return this.tikonService.getAllMyTikons(user);
  }

  @Post()
  @UseInterceptors(ImageInterceptor("image"))
  createTikon(
    @GetUser() user: UserEntity,
    @UploadedFile() image: Express.Multer.File,
    @Body() createTikonDto: CreateTikonDto
  ): Promise<void> {
    return this.tikonService.createTikon(user, image, createTikonDto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTikon(
    @GetUser() user: UserEntity,
    @Param("id") id: number
  ): Promise<void> {
    return this.tikonService.deleteTikon(user, id);
  }
}
