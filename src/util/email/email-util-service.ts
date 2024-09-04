import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendEmailException } from "src/exception/custom/send-email.exception";

@Injectable()
export class EmailUtilService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendEmail(email: string, code: string): Promise<void> {
    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get<string>("EMAIL_USER"),

        subject: "Test",

        template: "./email",
        context: {
          code: code,
        },
      })
      .then((value) => console.log("success : ", value))
      .catch((reason) => new SendEmailException());
  }
}
