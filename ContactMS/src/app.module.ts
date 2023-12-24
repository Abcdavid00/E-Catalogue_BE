import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './config/mysql.module';
import { Contact } from './entities/contact.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    TypeOrmModule.forFeature([
      Contact,
      Address
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
