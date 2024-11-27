import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from '../custom-logger/custom-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private customLogger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    this.customLogger.logRequest(request, context.getClass().name);

    return next.handle().pipe(
      tap(() => {
        this.customLogger.logResponse(response, context.getClass().name);
      }),
    );
  }
}
