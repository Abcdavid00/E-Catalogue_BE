import { BadRequestException, Controller, Get, Header, Post, Res, UploadedFile, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { error } from 'console';
import { PNGPipe } from './pipes/transform-image.pipe';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService  
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @UsePipes(PNGPipe)
  // async uploadFile(@UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) res) {
  //   console.log(file);
  //   const form = new FormData();

  //   form.append('file', file.buffer, {
  //     filename: file.originalname,
  //     contentType: file.mimetype,
  //   })

  //   try {
  //     const response = await firstValueFrom(this.httpService.post('http://fileserver:3456/upload', form))
  //     const img = await firstValueFrom(this.httpService.get('http://fileserver:3456/get/' + response.data, { responseType: 'arraybuffer' }))
  //     console.log(img.headers)
  //     console.log(img.data);
  //     res.contentType(img.headers['content-type']);
  //     res.attachment();
  
  //     return new StreamableFile(img.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   return error;
  // }

  // @Post('upload-multiple')
  // @UseInterceptors(FilesInterceptor('files'))
  // uploadFile_multiple(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  //   return files;
  // }

  // @Post('upload-multiple-field')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'avatar', maxCount: 1 },
  //   { name: 'background', maxCount: 1 }
  // ]))
  // uploadFile_multiple_field(@UploadedFiles() files: { avatar: Express.Multer.File[], background: Express.Multer.File[] }) {
  //   console.log(files);
  //   return files;
  // }

}
