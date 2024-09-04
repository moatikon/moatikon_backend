import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy } from './access.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [AccessStrategy],
  exports: [PassportModule, AccessStrategy],
})
export class CommonModule {}
