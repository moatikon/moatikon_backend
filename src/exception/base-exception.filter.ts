import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { format } from 'date-fns';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const req = context.getRequest();
    const res = context.getResponse();

    Logger.error(exception.response.message);

    res.status(exception.status).json({
      statusCode: exception.status,
      message: exception.response.message,
      timestamp: format(new Date(), 'yyyy-MM-dd'),
      path: req.url,
    });
  }
}
