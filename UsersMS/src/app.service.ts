import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  hi(): string {
    const hostname = require('os').hostname();
    return `Hello from UserMS( On ${hostname})!`;
  }
}
