import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-catalog API')
    .setDescription('E-catalog API description')
    .setVersion('1.0')
    .addTag('e-catalog')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  fs.writeFileSync("./Swagger-Spec.Json", JSON.stringify(Document));
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
