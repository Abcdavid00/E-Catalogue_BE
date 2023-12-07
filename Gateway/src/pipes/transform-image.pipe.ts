import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as convert from 'heic-convert';
import * as sharp from 'sharp';

@Injectable()
export class ToPNGPipe implements PipeTransform {
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    console.log("Pipe transform")
    if (!value || !value.mimetype.startsWith('image/')) {
      throw new BadRequestException(`Invalid file type uploaded (${value.mimetype})`);
    }

    let buffer: ArrayBuffer = value.buffer;
    let mimetype: string = value.mimetype;
    let size: number = value.size;
    let originalname: string = value.originalname.split('.')[0];

    switch (value.mimetype) {
      case 'image/heic':
        console.log("Converting HEIC to PNG")
        buffer = await convert({
          buffer: value.buffer,
          format: 'PNG'
        })
        mimetype = 'image/png';
        size = buffer.byteLength;
        originalname += '.png';
        break;
      case 'image/jpeg':
        console.log("Converting JPEG to PNG")
        buffer = await sharp(value.buffer)
          .png()
          .toBuffer()
        mimetype = 'image/png';
        size = buffer.byteLength;
        originalname += '.png';
        break;
      case 'image/png':
        size = buffer.byteLength;
        originalname += '.png';
        break;
      default:
        throw new BadRequestException(`File type not supported (${value.mimetype})`);
    }

    if (mimetype !== 'image/png') {
      throw new BadRequestException(`Image not supported (${value.mimetype})`);
    }
    
    console.log("Pipe transform done")
    return { ...value, buffer, mimetype, size, originalname };
  }
}

export const PNGPipe = new ToPNGPipe();