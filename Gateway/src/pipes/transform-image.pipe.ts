import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as convert from 'heic-convert';
import * as sharp from 'sharp';
import { ConvertToPNG } from 'src/file-server/image-converter';

@Injectable()
export class ToPNGPipe implements PipeTransform {
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata): Promise<Express.Multer.File> {
    console.log("Pipe transform")
    const res = await ConvertToPNG(value)
    console.log("Pipe transform done")
    return res
  }
}

export const PNGPipe = new ToPNGPipe();