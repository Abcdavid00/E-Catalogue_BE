import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileServerModule } from 'src/file-server/file-server.module';
import clientsModule from 'src/config/microservices.module';
import { OrderModule } from 'src/order/order.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    clientsModule,
    FileServerModule,
    UsersModule,
    OrderModule
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
