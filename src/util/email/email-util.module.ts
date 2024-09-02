import { Module } from "@nestjs/common";
import { EmailUtilService } from "./email-util-service";
import { MailerModule } from "@nestjs-modules/mailer";
import { emailPassword, emailUser } from "src/configs/configs";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: emailUser,
          pass: emailPassword,
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
  ],
  providers: [EmailUtilService],
  exports: [EmailUtilService],
})
export class EmailUtilModule {}
