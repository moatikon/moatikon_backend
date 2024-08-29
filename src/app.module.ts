import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/type-orm.config";
import { CommonModule } from "./common/common.module";
import { TikonModule } from './tikon/tikon.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    CommonModule,
    TikonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
