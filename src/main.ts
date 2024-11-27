import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { CustomLogger } from './common/custom-logger/custom-logger.service';
import { LoggingInterceptor } from './common/logging-interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useLogger(new CustomLogger(process.env.LOG_PATH));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(new CustomLogger()));

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('The Home Library Service description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {};

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('doc', app, documentFactory);

  const port = process.env.PORT || '4000';
  await app.listen(port);

  app.get(CustomLogger).log(`Server started on port ${port}`);
}

bootstrap();
