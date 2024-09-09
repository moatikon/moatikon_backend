import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthAccessGuard } from 'src/common/guard/auth-access.guard';
import { TikonService } from './tikon.service';
import { CreateTikonRequestDto } from './dto/request/create-tikon-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TikonEntity } from './tikon.entity';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';

@Controller('tikon')
@UsePipes(ValidationPipe)
@UseGuards(AuthAccessGuard)
export class TikonController {
  constructor(private tikonService: TikonService) {}

  @Get()
  getAllTikons(@GetUser() user: UserEntity): Promise<TikonEntity[]> {
    return this.tikonService.getAllTikons(user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createTikon(
    @GetUser() user: UserEntity,
    @UploadedFile() image: Express.Multer.File,
    @Body() createTikonRequestDto: CreateTikonRequestDto,
  ): Promise<void> {
    return this.tikonService.createTikon(user, image, createTikonRequestDto);
  }
}
