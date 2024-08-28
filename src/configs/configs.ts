import * as config from "config";

const serverConfig = config.get("server");
const dbConfig = config.get("db");
const jwtConfig = config.get("jwt");
//--------------------
export const serverPort:string = serverConfig.port;

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