import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const req = context.getRequest();
    const res = context.getResponse();

    res
      .status(exception.status)
      .json({
        statusCode: exception.status,
        message: exception.response.message,
        timestamp: new Date().toISOString(),
        path: req.url,
      });
  }
}