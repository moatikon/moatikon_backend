import { Module } from "@nestjs/common";
import { TokenUtilService } from "./token-util.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

import * as config from "config";
const jwtConfig = config.get("jwt");

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.access_expiresIn },
    }),
  ],
  providers: [TokenUtilService, JwtService],
  exports: [TokenUtilService],
})
export class TokenUtilModule {}
