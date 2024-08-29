import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TikonEntity } from "./tikon.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { CreateTikonDto } from "./dto/create-tikon.dto";
import { S3UtilService } from "src/util/s3/s3-util.service";

@Injectable()
export class TikonService {
  constructor(
    @InjectRepository(TikonEntity)
    private tikonRepository: Repository<TikonEntity>,
    private s3Util: S3UtilService
  ) {}

  async getAllMyTikons(user: UserEntity): Promise<TikonEntity[]> {
    return await this.tikonRepository.findBy({ user });
  }

  async createTikon(
    user: UserEntity,
    image: Express.Multer.File,
    createTikonDto: CreateTikonDto
  ): Promise<void> {
    const { storeName, tikonName, category, finishedTikon, discount } = createTikonDto;

    const s3FileName: string = await this.s3Util.imageUploadToS3(image);

    const tikon: TikonEntity = this.tikonRepository.create({
      id: null,
      image: s3FileName,
      storeName,
      tikonName,
      category,
      finishedTikon,
      discount,
      user,
    });

    await this.tikonRepository.save(tikon);
  }
}
