import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TikonService } from "./tikon.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateTikonDto } from "./dto/create-tikon.dto";
import { GetUser } from "src/common/get-user.decorator";
import { UserEntity } from "src/user/user.entity";
import { AuthAccessGuard } from "src/common/auth-access.guard";
import { TikonEntity } from "./tikon.entity";

@Controller("tikon")
@UsePipes(ValidationPipe)
@UseGuards(AuthAccessGuard)
export class TikonController {
  constructor(private tikonService: TikonService) {}

  @Get()
  getAllMyTikons(@GetUser() user: UserEntity): Promise<TikonEntity[]> {
    return this.tikonService.getAllMyTikons(user);
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
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
