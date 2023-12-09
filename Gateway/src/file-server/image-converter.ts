import { BadRequestException } from '@nestjs/common';
import * as convert from 'heic-convert';
import * as sharp from 'sharp';

export async function ConvertToPNG(
  file: Express.Multer.File,
): Promise<Express.Multer.File> {
  console.log('Converting to PNG');
  if (!file || !file.mimetype.startsWith('image/')) {
    throw new BadRequestException(
      `Invalid file type uploaded (${file.mimetype})`,
    );
  }

  let buffer: ArrayBuffer = file.buffer;
  let mimetype: string = file.mimetype;
  let size: number = file.size;
  let originalname: string = file.originalname.split('.')[0];

  switch (file.mimetype) {
    case 'image/heic':
      console.log('Converting HEIC to PNG');
      buffer = await convert({
        buffer: file.buffer,
        format: 'PNG',
      });
      mimetype = 'image/png';
      size = buffer.byteLength;
      originalname += '.png';
      break;
    case 'image/jpeg':
      console.log('Converting JPEG to PNG');
      buffer = await sharp(file.buffer).png().toBuffer();
      mimetype = 'image/png';
      size = buffer.byteLength;
      originalname += '.png';
      break;
    case 'image/png':
      size = buffer.byteLength;
      originalname += '.png';
      break;
    default:
      throw new BadRequestException(
        `File type not supported (${file.mimetype})`,
      );
  }

  if (mimetype !== 'image/png') {
    throw new BadRequestException(`Image not supported (${file.mimetype})`);
  }

  console.log('Converting to PNG done');
  return { ...file, buffer: Buffer.from(buffer), mimetype, size, originalname };
}
