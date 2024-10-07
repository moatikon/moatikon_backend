import { Module } from '@nestjs/common';
import { TikonController } from './tikon.controller';
import { TikonService } from './tikon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { S3Moduel } from '../util/s3/s3.module';
import { FcmModule } from '../util/fcm/fcm.module';

@Module({
  imports: [TypeOrmModule.forFeature([TikonEntity]), S3Moduel, FcmModule],
  controllers: [TikonController],
  providers: [TikonService],
})
export class TikonModule {}
