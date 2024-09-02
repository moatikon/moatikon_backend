import { Module } from "@nestjs/common";
import { TokenUtilService } from "./token-util.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "src/configs/jwt.config";

@Module({
  imports: [
    JwtModule.register(jwtConfig),
  ],
  providers: [TokenUtilService],
  exports: [TokenUtilService]
})
export class TokenUtilModule {}
