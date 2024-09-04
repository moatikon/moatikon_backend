import { Module } from "@nestjs/common";
import { TokenUtilService } from "./token-util.service";
import { JwtModule } from "@nestjs/jwt";
// import { jwtConfig } from "src/configs/jwt.config";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get<string>("JWT_ACCESS_EXE") },
      }),
    }),
  ],
  providers: [TokenUtilService],
  exports: [TokenUtilService],
})
export class TokenUtilModule {}