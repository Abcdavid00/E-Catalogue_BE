import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import clientsModule from './config/microservices.service';

@Module({
  imports: [
    clientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
