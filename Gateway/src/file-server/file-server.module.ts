import { Module } from '@nestjs/common';
import { FileServerService } from './file-server.service';
import { FileServerController } from './file-server.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [FileServerService],
  controllers: [FileServerController],
  exports: [FileServerService],
})
export class FileServerModule {}
