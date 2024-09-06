import { DeleteObjectsCommand, PutObjectAclCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { v1 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_USER_ACCESS,
        secretAccessKey: process.env.S3_USER_SECRET_ACCESS,
      },
    });
  }

  // Encoding
  #base64Encodeing(originalname: string): string {
    const buffer = Buffer.from(originalname + uuid(), "utf-8");
    const encoded = buffer.toString("base64url");

    return encoded;
  }

  async imageUpload(image: Express.Multer.File) {
    const filename = this.#base64Encodeing(image.originalname);
    const ext: string = image.mimetype.split("/")[1];

    const commend: PutObjectAclCommand = new PutObjectAclCommand({
      Key: `${filename}.${ext}`,
      Bucket: process.env.S3_BUCKET,
      ACL: 'public-read-write',
    });

    this.s3Client.send(commend);
    return `https://s3.${process.env.S3_REGION}.amazonaws.com/${process.env.S3_BUCKET}/${filename}.${ext}`;
  }

  async imageDeleteToS3(image: string): Promise<void> {
    const tikonImageKey = image.split("/")[4];

    const commend = new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Delete: { Objects: [{ Key: tikonImageKey }] },
    });

    await this.s3Client.send(commend);
  }
}
