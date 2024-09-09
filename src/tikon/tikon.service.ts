import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTikonRequestDto } from './dto/request/create-tikon-request.dto';
import { S3Service } from 'src/util/s3/s3.service';
import { MissingImageException } from 'src/exception/custom/missing-image.exception';
import { UserEntity } from 'src/user/user.entity';
import { UnableToCompleteTikonException } from 'src/exception/custom/unable-to-complete-tikon.exception';

@Injectable()
export class TikonService {
  constructor(
    @InjectRepository(TikonEntity)
    private tikonRepository: Repository<TikonEntity>,
    private s3Service: S3Service,
  ) {}

  async getAllTikons(user: UserEntity): Promise<TikonEntity[]> {
    return await this.tikonRepository.findBy({ user });
  }

  async createTikon(
    user: UserEntity,
    image: Express.Multer.File,
    createTikonRequest: CreateTikonRequestDto,
  ): Promise<void> {
    const { storeName, tikonName, category, finishedTikon, discount } =
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
    await this.tikonRepository.save(tikonEntity);
  }

  async completeTikon(user: UserEntity, id: number): Promise<void>{
    const result: DeleteResult = await this.tikonRepository.delete({ id, user });
    if(result.affected == 0) throw new UnableToCompleteTikonException();
  }
}
