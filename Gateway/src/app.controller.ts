import { BadRequestException, Controller, Get, Header, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { PNGPipe } from './pipes/transform-image.pipe';
import { FileServerService } from './file-server/file-server.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    private readonly fileServerService: FileServerService
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

}
