import { Module } from '@nestjs/common';
import { TikonController } from './tikon.controller';
import { TikonService } from './tikon.service';

@Module({
  controllers: [TikonController],
  providers: [TikonService]
})
export class TikonModule {}
