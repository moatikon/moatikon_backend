import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as multer from "multer";
import { Observable } from "rxjs";
import { MissingImageException } from "src/exception/custom/missing-image.exception";

// fieldName을 받기 위한 function
export function ImageInterceptor(fieldName: string): NestInterceptor {
  return new CustomImageInterceptor(fieldName);
}

// CustomImageInterceptor
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

      // multer를 사용해 formdata를 얻어내는 과정
      const upload = multer();
      const single = upload.single(this.fieldName);

      // 여기서 resolve, reject로 판별
      single(req, res, (err) => {
        console.log(req);
        
        if (err) {
          // 여기서 Custom하게 Exception을 설정할 수 있다.
          reject(new MissingImageException());
        } else {
          resolve(next.handle());
        }
      });
    });
  }
}