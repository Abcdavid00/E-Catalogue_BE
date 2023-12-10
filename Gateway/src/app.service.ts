import { Inject, Injectable } from '@nestjs/common';
import { UserInfoMSName, UsersMSName } from './config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject(UsersMSName)
    private readonly UsersClient: ClientProxy,
    @Inject(UserInfoMSName)
    private readonly UserInfoClient: ClientProxy,
  ) {}

  async getHello(): Promise<string> {
    const Message: String[] = [];
    Message.push("Hello from Gateway!");
    const res = await Promise.all([
      firstValueFrom(
        this.UsersClient.send<string>({ cmd: 'Hi' }, {})
      ),
      firstValueFrom(
        this.UserInfoClient.send<string>({ cmd: 'Hi' }, {})
      ),
    ])
    for (const r of res) {
      Message.push(r);
    }
    return Message.join('\n');
  }
}
