import { Module } from "@nestjs/common";
import { JwtAccessStrategy } from "./jwt-access.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), UserModule],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy, JwtRefreshStrategy, PassportModule],
})
export class CommonModule {}
