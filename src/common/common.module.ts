import { Module } from "@nestjs/common";
import { JwtAccessStrategy } from "./jwt-access.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [UserModule],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class CommonModule {}
