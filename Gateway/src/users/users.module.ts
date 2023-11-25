import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import clientsModule from 'src/config/microservices.service';

@Module({
  imports: [
    clientsModule,
    UsersModule
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
