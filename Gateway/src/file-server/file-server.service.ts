import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { PNGPipe } from 'src/pipes/transform-image.pipe';
import * as FormData from 'form-data';
import { Buffer } from 'node:buffer';

const FILESERVER_HOST = process.env.FILESERVER_HOST;
const FILESERVER_PORT = process.env.FILESERVER_PORT;
const FILESERVER_URL = `http://${FILESERVER_HOST}:${FILESERVER_PORT}/`;

@Injectable()
export class FileServerService {
  constructor(private readonly httpService: HttpService) {}


  async uploadImage(
    file: Express.Multer.File,
  ): Promise<string> {
    console.log(file);
    const form = new FormData();

    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(FILESERVER_URL + 'upload', form),
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getImage(id: string): Promise<{
    buffer: Buffer,
    mimeType: string,
  }
  > {
    try {
      const img = await firstValueFrom(
        this.httpService.get(FILESERVER_URL + 'get/' + id, {
          responseType: 'arraybuffer',
        }),
      );
      return { buffer: img.data, mimeType: img.headers['content-type'] };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
