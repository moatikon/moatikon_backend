import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v1 as uuid } from "uuid";

@Injectable()
export class S3UtilService {
  s3Client: S3Client;
  region = this.configService.get<string>("S3_REGION");
  bucketName = this.configService.get<string>("S3_BUCKET_NAME");

  constructor(
    private configService: ConfigService,

    // private region = configService.get<string>("S3_REGION"),
    // private bucketName = configService.get<string>("S3_BUCKET_NAME"),
  ) {
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: configService.get<string>("S3_ACCESS_KEY"),
        secretAccessKey: configService.get<string>("S3_SECRET_ACCESS_KEY"),
      },
    });
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
      Bucket: this.bucketName,
      Key: `${filename}.${ext}`,
      Body: image.buffer,
      ACL: "public-read-write",
      ContentType: image.mimetype,
    });

    this.s3Client.send(commend);
    return `https://s3.${this.region}.amazonaws.com/${this.bucketName}/${filename}.${ext}`;
  }

  async imageDeleteToS3(image: string): Promise<void> {
    const tikonImageKey = image.split("/")[4];

    const commend = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: { Objects: [{ Key: tikonImageKey }] },
    });

    await this.s3Client.send(commend);
  }
}
