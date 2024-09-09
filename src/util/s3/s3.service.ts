import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v1 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  s3Client: S3Client;
  constructor(private config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('S3_USER_ACCESS'),
        secretAccessKey: this.config.get<string>('S3_USER_SECRET_ACCESS'),
      },
    });
  }

  // Encoding
  #base64Encodeing(originalname: string): string {
    const buffer = Buffer.from(originalname + uuid(), 'utf-8');
    const encoded = buffer.toString('base64url');

    return encoded;
  }

  async imageUpload(image: Express.Multer.File): Promise<string> {
    const filename = this.#base64Encodeing(image.filename);
    const ext: string = image.mimetype.split('/')[1];

    const commend = new PutObjectCommand({
      Bucket: this.config.get<string>('S3_BUCKET'),
      Key: `${filename}.${ext}`,
      Body: image.buffer,
      ACL: "public-read-write",
      ContentType: image.mimetype,
    });
  
    const uploadFileS3 = await this.s3Client.send(commend);
    if(uploadFileS3.$metadata.httpStatusCode != 200){
      throw new BadRequestException("S3 File Upload Fail")
    }
    return `https://s3.${this.config.get<string>('S3_REGION')}.amazonaws.com/${this.config.get<string>('S3_BUCKET')}/${filename}.${ext}`;
  }

  async imageDeleteToS3(image: string): Promise<void> {
    const tikonImageKey = image.split('/')[4];

    const commend = new DeleteObjectsCommand({
      Bucket: this.config.get<string>('S3_BUCKET'),
      Delete: { Objects: [{ Key: tikonImageKey }] },
    });

    await this.s3Client.send(commend);
  }
}
