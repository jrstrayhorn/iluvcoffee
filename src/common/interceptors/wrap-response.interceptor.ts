import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    // next.handle() calls the route handler - its an observable stream!!!
    // for debugging - tap((data) => console.log('After...', data))
    return next.handle().pipe(map((data) => ({ data })));
  }
}
