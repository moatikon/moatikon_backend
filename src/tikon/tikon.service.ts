import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { Repository } from 'typeorm';
import { CreateTikonRequestDto } from './dto/request/create-tikon-request.dto';
import { S3Service } from 'src/util/s3/s3.service';
import { MissingImageException } from 'src/exception/custom/missing-image.exception';

@Injectable()
export class TikonService {
  constructor(
    @InjectRepository(TikonEntity)
    private tikonRepository: Repository<TikonEntity>,
    private s3Service: S3Service,
  ) {}

  async createTikon(image: Express.Multer.File, createTikonRequest: CreateTikonRequestDto):Promise<void> {
    const {storeName, tikonName, category, finishedTikon, discount} = createTikonRequest;
    if(!image) throw new MissingImageException();

    const imagePath: string = await this.s3Service.imageUpload(image);
    const tikonEntity: TikonEntity = this.tikonRepository.create({
      id: null,
      image: imagePath,
      storeName,
      tikonName,
      category,finishedTikon,discount
    });
    await this.tikonRepository.save(tikonEntity);
  }
}