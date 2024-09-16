import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FcmService {
  constructor(
    private schedulerRegistry: SchedulerRegistry
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID,
        privateKey: process.env.FB_PRIVATE_KEY,
        clientEmail: process.env.FB_CLIENT_EMAIL,
      }),
    });
  }

  async fcm(token: string, title: string, message: string):Promise<string> {
    const payload: Message = {
      token: token,
      notification: {
        title: title,
        body: message,
      },
      data: {
        body: message,
      },
    };
    const result: string = await admin
      .messaging()
      .send(payload)
      .then((response) => response)
      .catch((error) => error.code);
    return result;
  }

  async cronFcm(name:string, date: string, token: string, title: string, message: string):Promise<void>{
    const job = new CronJob(new Date(date), async () => {
      await this.fcm(token, title, message);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
}
