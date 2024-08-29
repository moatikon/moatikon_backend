import { Module } from '@nestjs/common';
import { S3UtilService } from './s3-util.service';

@Module({
  providers: [S3UtilService]
})
export class S3UtilModule {}
