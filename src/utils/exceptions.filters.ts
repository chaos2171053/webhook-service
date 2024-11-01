import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // Handle exceptions that occur during the request lifecycle
  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    // Determine the HTTP status code to return
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus() // Get the status from the HttpException
        : HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 Internal Server Error
    //console.log('exception', exception.response)

    const responseBody = {
      code: httpStatus,
      data: exception?.response?.data || {},
      message:
        exception?.message ||
        exception?.response?.message ||
        'Internal Server Error',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
