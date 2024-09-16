import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
