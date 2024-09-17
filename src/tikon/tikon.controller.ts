import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthAccessGuard } from 'src/common/guard/auth-access.guard';
import { TikonService } from './tikon.service';
import { CreateTikonRequestDto } from './dto/request/create-tikon-request.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { TikonsResponseDto } from './dto/response/tikons_response.dto';
import { ImageInterceptor } from 'src/common/interceptor/image.interceptor';

@Controller('tikon')
@UsePipes(ValidationPipe)
@UseGuards(AuthAccessGuard)
export class TikonController {
  constructor(private tikonService: TikonService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTikons(@GetUser() user: UserEntity, @Query('page') page: number = 0): Promise<TikonsResponseDto> {
    return this.tikonService.getAllTikons(user, page);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ImageInterceptor('image'))
  createTikon(
    @GetUser() user: UserEntity,
    @UploadedFile() image: Express.Multer.File,
    @Body() createTikonRequestDto: CreateTikonRequestDto,
  ): Promise<void> {
    return this.tikonService.createTikon(user, image, createTikonRequestDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  completeTikon(
    @GetUser() user: UserEntity,
    @Query('id') id: string,
  ): Promise<void> {
    return this.tikonService.completeTikon(user, id);
  }
}
