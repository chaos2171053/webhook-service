import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface for the standardized response structure
export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export default class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Get the HTTP status code from the response
        const code = context.switchToHttp().getResponse().statusCode;
        // Determine the message based on the status code and response data
        const message =
          data?.message || Number(code) === 200 ? 'success' : 'error';
        // Return the standardized response format
        return {
          code,
          message,
          data,
        };
      }),
    );
  }
}
