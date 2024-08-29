import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";

import { format } from "date-fns";

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const req = context.getRequest();
    const res = context.getResponse();

    Logger.error(exception);

    res.status(exception.statusCode || 400).json({
      message: exception.response.message,
      statusCode: exception.statusCode || 400,
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      path: req.url,
    });
  }
}
