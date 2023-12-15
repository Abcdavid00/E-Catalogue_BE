import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './config/mysql.module';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Style } from './entities/style.entity';
import { Brand } from './entities/brand.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      mysqlConfig
    ),
    TypeOrmModule.forFeature([
      Product,
      Category,
      Style,
      Brand,
      ProductVariant,
      ProductImage
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
