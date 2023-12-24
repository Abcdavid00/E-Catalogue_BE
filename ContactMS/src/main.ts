import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const PORT = process.env.PORT;
const HEALTHCHECK_PORT = process.env.HEALTHCHECK_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(PORT),
  }})
  await app.startAllMicroservices();
  await app.listen(HEALTHCHECK_PORT);
}
bootstrap();