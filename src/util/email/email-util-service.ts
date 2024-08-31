import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { emailUser } from "src/configs/configs";

@Injectable()
export class EmailUtilService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, token: string): Promise<void> {
    
    this.mailerService
      .sendMail({
        to: email,
        from: emailUser,

        subject: "Test",

        template: "./email",
        context: {
          code: token,
        },
      })
      .then((value) => console.log("success : ", value))
      .catch((reason) => console.log("error : ", reason));
  }
}
