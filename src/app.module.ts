import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/type-orm.config";
import { TokenUtilModule } from "./util/token/token-util.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UserModule, TokenUtilModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
