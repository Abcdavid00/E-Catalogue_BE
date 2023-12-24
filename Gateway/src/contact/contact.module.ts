import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import clientsModule from 'src/config/microservices.module';

@Module({
  imports: [
    clientsModule,
  ],
  providers: [ContactService],
  controllers: [ContactController]
})
export class ContactModule {}
