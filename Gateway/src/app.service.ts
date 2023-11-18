import { Inject, Injectable } from '@nestjs/common';
import { UsersMSName } from './config/microservices.config';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject(UsersMSName)
    private readonly UsersClient: ClientProxy
  ) {}

  async getHello(): Promise<string> {
    const Message: String[] = [];
    Message.push("Hello from Gateway!");
    Message.push(
      await firstValueFrom(
        this.UsersClient.send<string>({ cmd: 'Hi' }, {})
      )
    );
    return Message.join('\n');
  }
}
