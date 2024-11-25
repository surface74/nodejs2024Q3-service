import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { CustomLogger } from './common/custom-logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useLogger(new CustomLogger(process.env.LOG_PATH));
  app.useGlobalPipes(new ValidationPipe());

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

  console.log(`Server started on port ${port}`);
}
bootstrap();

process.on('uncaughtException', (error) => {
  const message = `${error.message} ${error.stack}`;

  const logger = new CustomLogger();
  logger.fatal(message, 'uncaughtException');

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const message = `Unhandled rejection at: ${promise}, reason: ${reason}`;

  const logger = new CustomLogger();
  logger.error(message, 'unhandledRejection');
});
