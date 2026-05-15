import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validateEnv } from './config/env';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('COMUTEL ITSM - Problems Service')
    .setDescription('Gestión de problemas: investigación, causa raíz, workaround')
    .setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(3003);
}
bootstrap();
