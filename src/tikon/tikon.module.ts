import { Module } from "@nestjs/common";
import { TikonController } from "./tikon.controller";
import { TikonService } from "./tikon.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TikonEntity } from "./tikon.entity";
import { S3UtilModule } from "src/util/s3/s3-util.module";

@Module({
  imports: [TypeOrmModule.forFeature([TikonEntity]), S3UtilModule],
  controllers: [TikonController],
  providers: [TikonService],
})
export class TikonModule {}
