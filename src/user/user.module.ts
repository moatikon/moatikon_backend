import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { TokenModule } from 'src/util/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([UserEntity])]
})
export class UserModule {}
