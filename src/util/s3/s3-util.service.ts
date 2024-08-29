import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import {
  s3AccessKey,
  s3BucketName,
  s3Region,
  s3SecretAccessKey,
} from "src/configs/configs";

@Injectable()
export class S3UtilService {
  s3Client: S3Client = new S3Client({
    region: s3Region,
    credentials: {
      accessKeyId: s3AccessKey,
      secretAccessKey: s3SecretAccessKey,
    },
  });

  async imageUploadToS3(file: Express.Multer.File) {
    console.log(file.mimetype);

    const commend = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: file.filename,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    });

    this.s3Client.send(commend);
  }
}
