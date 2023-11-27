import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const PORT: number = +process.env.PORT || 3000;
const HEALTHCHECK_PORT = process.env.HEALTHCHECK_PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORT,
    },
  });
  await app.startAllMicroservices();
  await app.listen(HEALTHCHECK_PORT);
}
bootstrap();
