import {
  Body,
  Controller,
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


@Controller('tikon')
@UsePipes(ValidationPipe)
@UseGuards(AuthAccessGuard)
export class TikonController {
  constructor(private tikonService: TikonService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createTikon(
    @UploadedFile() image: Express.Multer.File,
    @Body() createTikonRequestDto: CreateTikonRequestDto,
  ): Promise<void> {
    return this.tikonService.createTikon(image, createTikonRequestDto);
  }
}
