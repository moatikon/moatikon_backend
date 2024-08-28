import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { TokenUtilModule } from 'src/util/token/token-util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TokenUtilModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([UserEntity]),]
})
export class UserModule {}
