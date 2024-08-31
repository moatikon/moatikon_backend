import * as config from "config";

const serverConfig = config.get("server");
const dbConfig = config.get("db");
const jwtConfig = config.get("jwt");
const s3Config = config.get("s3");
const emailConfig = config.get("email");
//--------------------
export const serverPort: string = serverConfig.port;

export const dbType = dbConfig.type;
export const dbPort: number = dbConfig.port;
export const dbDatabase: string = dbConfig.database;
export const dbHost: string = dbConfig.host;
export const dbUsername: string = dbConfig.username;
export const dbPassword: string = dbConfig.password;
export const dbSynchronize: boolean = dbConfig.synchronize;

export const jwtAccessExe: number = jwtConfig.accessExe;
export const jwtRefreshExe: number = jwtConfig.refreshExe;
export const jwtSecret: string = jwtConfig.secret;
export const jwtReSecret: string = jwtConfig.reSecret;

export const s3Region: string = s3Config.region;
export const s3BucketName: string = s3Config.bucketName;
export const s3AccessKey: string = s3Config.accessKey;
export const s3SecretAccessKey: string = s3Config.secretAccessKey;
export const s3Arn: string = s3Config.arn;

export const emailUser: string = emailConfig.user;
export const emailPassword: string = emailConfig.password;
