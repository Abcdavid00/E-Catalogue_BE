import { Inject, Injectable } from '@nestjs/common';
import { ContactMSName, OrderMSName, ProductMSName, UserInfoMSName, UsersMSName } from './config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject(UsersMSName)
    private readonly UsersClient: ClientProxy,
    @Inject(UserInfoMSName)
    private readonly UserInfoClient: ClientProxy,
    @Inject(ProductMSName)
    private readonly ProductClient: ClientProxy,
    @Inject(ContactMSName)
    private readonly ContactClient: ClientProxy,
    @Inject(OrderMSName)
    private readonly OrderClient: ClientProxy,
  ) {}

  async getHello(): Promise<string> {
    const Message: String[] = [];
    Message.push("Hello from Gateway!");

    const clients = [
      { name: 'UsersMS', client: this.UsersClient },
      { name: 'UserInfoMS', client: this.UserInfoClient },
      { name: 'ProductMS', client: this.ProductClient },
      { name: 'ContactMS', client: this.ContactClient },
      { name: 'OrderMS', client: this.OrderClient },
    ];

    const promises = clients.map(({ name, client }) =>
      firstValueFrom(client.send<string>({ cmd: 'Hi' }, {}))
        .then(() => ({ name, status: 'Online' }))
        .catch((error) => {
          console.log(`${name} is offline: ${error.message}`);
          return { name, status: 'Offline' };
        })
    );

    const res = await Promise.all(promises);

    for (const { name, status } of res) {
      Message.push(`<span style="color:${status === 'Offline' ? 'red' : 'green' }">${name} is ${status}!</span>`);
    }

    return "<h2>" + Message.join('<br>') + "</h2>";
  }
}
