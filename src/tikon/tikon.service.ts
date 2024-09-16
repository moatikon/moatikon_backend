import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTikonRequestDto } from './dto/request/create-tikon-request.dto';
import { S3Service } from 'src/util/s3/s3.service';
import { MissingImageException } from 'src/exception/custom/missing-image.exception';
import { UserEntity } from 'src/user/user.entity';
import { UnableToCompleteTikonException } from 'src/exception/custom/unable-to-complete-tikon.exception';
import { TikonsResponseDto } from './dto/response/tikons_response.dto';
import { FcmService } from 'src/util/fcm/fcm.service';
import {v1 as uuid} from 'uuid';

@Injectable()
export class TikonService {
  constructor(
    @InjectRepository(TikonEntity)
    private tikonRepository: Repository<TikonEntity>,
    private s3Service: S3Service,
    private fcmService: FcmService,
  ) {}

  async getAllTikons(user: UserEntity, page: number): Promise<TikonsResponseDto> {
    let take = 15;

    const [tikons, li]: [TikonEntity[], number] =
      await this.tikonRepository.findAndCount({
        where: { user },
        take: take,
        skip: take * page,
      });

    return new TikonsResponseDto(tikons);
  }

  async createTikon(
    user: UserEntity,
    image: Express.Multer.File,
    createTikonRequest: CreateTikonRequestDto,
  ): Promise<void> {
    const { storeName, tikonName, category, finishedTikon, discount, deviceToken } =
      createTikonRequest;
    if (!image) throw new MissingImageException();

    const imagePath: string = await this.s3Service.imageUpload(image);
    const tikonEntity: TikonEntity = this.tikonRepository.create({
      id: null,
      user: user,
      image: imagePath,
      storeName,
      tikonName,
      category,
      finishedTikon,
      discount,
    });
    
    await this.fcmService.cronFcm(
      uuid(),
      finishedTikon,
      deviceToken,
      '모아티콘 기프티콘 만료알림',
      `${tikonName}이 오늘이면 만료됩니다. 서둘러 사용해 주세요!`,
    );

    await this.tikonRepository.save(tikonEntity);
  }

  async completeTikon(user: UserEntity, id: number): Promise<void> {
    const tikon: TikonEntity = await this.tikonRepository.findOneBy({ id });
  
    const result: DeleteResult = await this.tikonRepository.delete({ id,user });
    if (result.affected == 0) throw new UnableToCompleteTikonException();
    await this.s3Service.imageDeleteToS3(tikon.image);
  }
}
