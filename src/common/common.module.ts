import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy } from './access.strategy';
import { UserModule } from 'src/user/user.module';
import { RefreshStrategy } from './refresh.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [AccessStrategy, RefreshStrategy],
  exports: [PassportModule, AccessStrategy, RefreshStrategy],
})
export class CommonModule {}
