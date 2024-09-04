import { Module } from "@nestjs/common";
import { EmailUtilService } from "./email-util-service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [MailerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: config.get<string>("EMAIL_USER"),
          pass: config.get<string>("EMAIL_PASSWORD"),
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: "src/util/email/templates/",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  })],
  providers: [EmailUtilService],
  exports: [EmailUtilService],
})
export class EmailUtilModule {}
