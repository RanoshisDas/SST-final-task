import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;

        console.log(`Request started for ${method} ${url}`);

        return next.handle().pipe(
            tap(() => {
                const time = Date.now() - now;
                console.log(`Response got for ${method} ${url} in- ${time}ms`);
            })
        );
    }
}