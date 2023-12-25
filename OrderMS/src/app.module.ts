import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mysqlConfig } from './config/mysql.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Item } from './entities/item.entity';
import { Order } from './entities/order.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    TypeOrmModule.forFeature([
      Cart,
      Item,
      Order,
      Rating
    ]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
