import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import clientsModule from './config/microservices.module'
import { HttpModule } from '@nestjs/axios';
import { FileServerModule } from './file-server/file-server.module';
import { UserInfoMsModule } from './user-info-ms/user-info-ms.module';

@Module({
  imports: [
    clientsModule,
    UsersModule,
    AuthModule,
    HttpModule,
    FileServerModule,
    UserInfoMsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
