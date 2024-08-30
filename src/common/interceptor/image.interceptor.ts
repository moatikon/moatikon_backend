import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as multer from "multer";
import { Observable } from "rxjs";
import { MissingImageException } from "src/exception/custom/missing-image.exception";

export function ImageInterceptor(fieldName: string): NestInterceptor {
  return new CustomImageInterceptor(fieldName);
}

export class CustomImageInterceptor implements NestInterceptor {
  fieldName: string;
  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return new Promise((resolve, reject) => {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();

      const upload = multer();
      const single = upload.single(this.fieldName);

      single(req, res, (err) => {
        if (err) {
          reject(new MissingImageException());
        } else {
          resolve(next.handle());
        }
      });
    });
  }
}
