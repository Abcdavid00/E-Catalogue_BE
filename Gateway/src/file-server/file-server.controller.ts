import { Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { PNGPipe } from 'src/pipes/transform-image.pipe';
import { FileServerService } from './file-server.service';

@Controller('file-server')
export class FileServerController {

    constructor(
        private readonly fileServerService: FileServerService
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({ type: String })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      }
    })
    @UsePipes(PNGPipe)
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) res): Promise<string> {
      // console.log(file);
      // const form = new FormData();
  
      // form.append('file', file.buffer, {
      //   filename: file.originalname,
      //   contentType: file.mimetype,
      // })
  
      // try {
      //   const response = await firstValueFrom(this.httpService.post('http://fileserver:3456/upload', form))
      //   const img = await firstValueFrom(this.httpService.get('http://fileserver:3456/get/' + response.data, { responseType: 'arraybuffer' }))
      //   console.log(img.headers)
      //   console.log(img.data);
      //   res.contentType(img.headers['content-type']);
      //   res.attachment();
      //   // console.log("Type of data: " + JSON.stringify(img.data))
      //   console.log("Data:")
      //   console.log(img)
    
      //   return new StreamableFile(img.data);
      // } catch (error) {
      //   console.log(error);
      // }
      // return error;
      return this.fileServerService.uploadImage(file)
    }
  
    @Get('get/:id')
    @ApiOkResponse({ type: StreamableFile })
    async getImage(@Res({ passthrough: true }) res, @Param('id') id: string) {
      const image = await this.fileServerService.getImage(id)
      res.contentType(image.mimeType);
      res.attachment();
      return new StreamableFile(image.buffer);
    }
  
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
