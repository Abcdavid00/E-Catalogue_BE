import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import clientsModule from './config/microservices.module'
import { HttpModule } from '@nestjs/axios';
import { FileServerModule } from './file-server/file-server.module';

@Module({
  imports: [
    clientsModule,
    UsersModule,
    AuthModule,
    HttpModule,
    FileServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
