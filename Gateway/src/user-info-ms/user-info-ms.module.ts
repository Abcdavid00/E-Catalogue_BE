import { Module } from '@nestjs/common';
import { UserInfoMsService } from './user-info-ms.service';
import { UserInfoMsController } from './user-info-ms.controller';
import { UsersModule } from 'src/users/users.module';
import clientsModule from 'src/config/microservices.module';
import { FileServerModule } from 'src/file-server/file-server.module';

@Module({
  imports: [
    clientsModule,
    UsersModule,
    FileServerModule,
  ],
  providers: [UserInfoMsService],
  controllers: [UserInfoMsController],
  exports: [UserInfoMsService]
})
export class UserInfoMsModule {}
