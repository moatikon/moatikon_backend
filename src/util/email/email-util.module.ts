import { Module } from "@nestjs/common";
import { EmailUtilService } from "./email-util-service";
import { MailerModule } from "@nestjs-modules/mailer";
import { emailConfig } from "src/configs/email.config";

@Module({
  imports: [MailerModule.forRoot(emailConfig)],
  providers: [EmailUtilService],
  exports: [EmailUtilService],
})
export class EmailUtilModule {}
