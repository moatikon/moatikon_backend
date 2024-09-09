import { Module } from '@nestjs/common';
import { TikonController } from './tikon.controller';
import { TikonService } from './tikon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { S3Moduel } from 'src/util/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([TikonEntity]), S3Moduel],
  controllers: [TikonController],
  providers: [TikonService],
})
export class TikonModule {}
