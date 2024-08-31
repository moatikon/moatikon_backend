import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { TokenUtilModule } from 'src/util/token/token-util.module';
import { EmailUtilModule } from 'src/util/email/email-util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TokenUtilModule,
    EmailUtilModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([UserEntity]),]
})
export class UserModule {}
