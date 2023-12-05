import { Controller, Get, Header, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import sharp from 'sharp';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) res) {
    console.log(file);

    sharp(file.buffer)
      .jpeg()
      .toBuffer()
      .then(data => {
        res.contentType('image/jpeg');
        res.attachment();
        res.send(data);
      })

    // res.contentType(file.mimetype);
    // res.attachment();
    // // res.send(file.buffer);
    // return new StreamableFile(file.buffer);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile_multiple(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return files;
  }

  @Post('upload-multiple-field')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 }
  ]))
  uploadFile_multiple_field(@UploadedFiles() files: { avatar: Express.Multer.File[], background: Express.Multer.File[] }) {
    console.log(files);
    return files;
  }

}
