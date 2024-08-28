import { Module } from "@nestjs/common";
import { JwtAccessStrategy } from "./jwt-access.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";

@Module({
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class CommonModule {}
