import { S3ClientConfigType } from "@aws-sdk/client-s3";
import { s3AccessKey, s3Region, s3SecretAccessKey } from "./configs";

export const s3Config: S3ClientConfigType = {
  region: s3Region,
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretAccessKey,
  },
};
