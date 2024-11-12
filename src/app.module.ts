import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/type-orm.config';
import { TikonModule } from './tikon/tikon.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenModule } from './util/token/token.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_EXE: Joi.number().required(),
        JWT_RE_EXE: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_RE_SECRET: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PW: Joi.string().required(),
        DB_DB: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.string().required(),
        S3_REGION: Joi.string().required(),
        S3_BUCKET: Joi.string().required(),
        S3_USER_ACCESS: Joi.string().required(),
        S3_USER_SECRET_ACCESS: Joi.string().required(),
        MAILER_USER: Joi.string().required(),
        MAILER_PW: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        REDIS_PW: Joi.string().required(),
        CODE_CHECK_SECRET: Joi.string().required(),
        FB_TYPE: Joi.string().required(),
        FB_PROJECT_ID: Joi.string().required(),
        FB_PRIVATE_KEY_ID: Joi.string().required(),
        FB_PRIVATE_KEY: Joi.string().required(),
        FB_CLIENT_EMAIL: Joi.string().required(),
        FB_CLIENT_ID: Joi.string().required(),
        FB_AUTH_URI: Joi.string().required(),
        FB_TOKEN_URI: Joi.string().required(),
        FB_AUTH_PROVIDER_X509_CERT_URL: Joi.string().required(),
        FB_CLIENT_X509_CERT_URL: Joi.string().required(),
        FB_UNIVERSE_DOMAIN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeORMConfig),
    CommonModule,
    UserModule,
    TikonModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
