import { Module } from "@nestjs/common";
import { TikonController } from "./tikon.controller";
import { TikonService } from "./tikon.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TikonEntity } from "./tikon.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TikonEntity])],
  controllers: [TikonController],
  providers: [TikonService],
})
export class TikonModule {}
