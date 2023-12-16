import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileServerModule } from 'src/file-server/file-server.module';
import clientsModule from 'src/config/microservices.module';

@Module({
  imports: [
    clientsModule,
    FileServerModule
  ],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
