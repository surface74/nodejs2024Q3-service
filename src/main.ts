import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('The Home Library Service description')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {};

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('doc', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || '4000';
  await app.listen(port);

  console.log(`Server started on port ${port}`);
}
bootstrap();
