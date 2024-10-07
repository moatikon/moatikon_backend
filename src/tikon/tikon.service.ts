import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTikonRequestDto } from './dto/request/create-tikon-request.dto';
import { S3Service } from '../util/s3/s3.service';
import { MissingImageException } from '../exception/custom/missing-image.exception';
import { UserEntity } from '../user/user.entity';
import { UnableToCompleteTikonException } from '../exception/custom/unable-to-complete-tikon.exception';
import { TikonsResponseDto } from './dto/response/tikons_response.dto';
import { FcmService } from '../util/fcm/fcm.service';
import { v4 as uuid } from 'uuid';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobNotFoundException } from '../exception/custom/job-not-found.exception';
import { addDays } from 'date-fns';

@Injectable()
export class TikonService {
  constructor(
    @InjectRepository(TikonEntity)
    private tikonRepository: Repository<TikonEntity>,
    private s3Service: S3Service,
    private fcmService: FcmService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async getAllTikons(
    user: UserEntity,
    page: number,
  ): Promise<TikonsResponseDto> {
    let take = 15;

    const [tikons, li]: [TikonEntity[], number] =
      await this.tikonRepository.findAndCount({
        where: { user },
        take: take,
        skip: take * page,
      });

    return new TikonsResponseDto(tikons);
  }

  async deleteTikon(
    user: UserEntity,
    id: string,
    tikon: TikonEntity,
  ): Promise<void> {
    const result: DeleteResult = await this.tikonRepository.delete({
      id,
      user,
    });
    if (result.affected == 0) throw new UnableToCompleteTikonException();
    await this.s3Service.imageDeleteToS3(tikon.image);
  }

  async createTikon(
    user: UserEntity,
    image: Express.Multer.File,
    createTikonRequest: CreateTikonRequestDto,
  ): Promise<void> {
    const {
      storeName,
      tikonName,
      category,
      finishedTikon,
      discount,
      deviceToken,
    } = createTikonRequest;
    if (!image) throw new MissingImageException();

    const name: string = uuid();

    const imagePath: string = await this.s3Service.imageUpload(image);
    const tikonEntity: TikonEntity = this.tikonRepository.create({
      id: name,
      user: user,
      image: imagePath,
      storeName,
      tikonName,
      category,
      finishedTikon,
      discount,
    });

    const job = new CronJob(new Date(finishedTikon), async () => {
      await this.fcmService.fcm(
        deviceToken,
        '모아티콘 기프티콘 만료알림',
        `${tikonName}이 오늘이면 만료됩니다. 서둘러 사용해 주세요!`,
      );
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    await this.tikonRepository.save(tikonEntity);
  }

  async completeTikon(user: UserEntity, id: string): Promise<void> {
    const tikon: TikonEntity = await this.tikonRepository.findOneBy({ id });

    if (new Date(tikon.finishedTikon) > new Date()) {
      try {
        const job = this.schedulerRegistry.getCronJob(id);
        job.stop();
      } catch (_) {
        throw new JobNotFoundException();
      }
    }

    await this.deleteTikon(user, id, tikon);
  }
}
