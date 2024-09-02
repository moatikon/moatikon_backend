import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { s3BucketName, s3Region } from "src/configs/configs";
import { s3Config } from "src/configs/s3.config";
import { v1 as uuid } from "uuid";

@Injectable()
export class S3UtilService {
  s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client(s3Config);
  }

  #base64Encodeing(originalname: string): string {
    const buffer = Buffer.from(originalname + uuid(), "utf-8");
    const encoded = buffer.toString("base64url");

    return encoded;
  }

  async imageUploadToS3(image: Express.Multer.File): Promise<string> {
    const filename = this.#base64Encodeing(image.originalname);
    const ext: string = image.mimetype.split("/")[1];

    const commend = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: `${filename}.${ext}`,
      Body: image.buffer,
      ACL: "public-read-write",
      ContentType: image.mimetype,
    });

    this.s3Client.send(commend);
    return `https://s3.${s3Region}.amazonaws.com/${s3BucketName}/${filename}.${ext}`;
  }

  async imageDeleteToS3(image: string): Promise<void> {
    const tikonImageKey = image.split("/")[4];

    const commend = new DeleteObjectsCommand({
      Bucket: s3BucketName,
      Delete: { Objects: [{ Key: tikonImageKey }] },
    });

    await this.s3Client.send(commend);
  }
}
