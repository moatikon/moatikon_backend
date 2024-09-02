import { JwtModuleOptions } from "@nestjs/jwt";
import { jwtAccessExe, jwtSecret } from "./configs";

export const jwtConfig: JwtModuleOptions = {
  secret: jwtSecret,
  signOptions: { expiresIn: jwtAccessExe },
};
