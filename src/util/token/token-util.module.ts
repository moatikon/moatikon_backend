import { Module } from "@nestjs/common";
import { TokenUtilService } from "./token-util.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtAccessExe, jwtSecret } from "src/configs/configs";

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: jwtAccessExe },
    }),
  ],
  providers: [TokenUtilService],
  exports: [TokenUtilService]
})
export class TokenUtilModule {}
