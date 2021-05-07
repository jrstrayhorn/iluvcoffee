import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // does primative type converstion for boolean/numbers, slight performance hit doing this so weight the cost if needed
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
