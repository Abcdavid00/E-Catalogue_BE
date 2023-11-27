import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersMSName } from 'src/config/microservices.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject(UsersMSName)
    private readonly UsersClient: ClientProxy
  ) {}

  async getHello(): Promise<string> {
    const Message: String[] = [];
    Message.push("Hello from TokenMS!");
    Message.push(
      await firstValueFrom(
        this.UsersClient.send<string>({ cmd: 'Hi' }, {})
      )
    )
    return Message.join('\n');
  }
}
