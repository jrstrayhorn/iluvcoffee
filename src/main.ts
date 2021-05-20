import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // limitation, can't inject dependency
  // because outside context of module
  app.useGlobalPipes(
    // scoped globally
    new ValidationPipe({
      whitelist: true,
      transform: true, // does primative type converstion for boolean/numbers, slight performance hit doing this so weight the cost if needed
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // will automatically convert to TS type - dont need to use @Type decorator on dtos
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
