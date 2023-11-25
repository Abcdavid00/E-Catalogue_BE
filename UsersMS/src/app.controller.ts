import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'Hi' })
  ping(_: any): string {

    return this.appService.hi();
  }

  @MessagePattern({ cmd: 'isUsernameAvailable' })
  async isUsernameAvailable(username: string): Promise<boolean> {
    return this.appService.isUsernameAvailable(username);
  }

  @MessagePattern({ cmd: 'isEmailAvailable' })
  async isEmailAvailable(email: string): Promise<boolean> {
    return this.appService.isEmailAvailable(email);
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(username: string, email: string, password: string): Promise<any> {
    return this.appService.createUser(username, email, password);
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(id: number): Promise<any> {
    return this.appService.getUser(id);
  }

  @MessagePattern({ cmd: 'findUserByUsername' })
  async findUserByUsername(username: string): Promise<any> {
    return this.appService.findUserByUsername(username);
  }

  @MessagePattern({ cmd: 'findUserByEmail' })
  async findUserByEmail(email: string): Promise<any> {
    return this.appService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: 'signIn' })
  async signIn(username: string, password: string): Promise<any> {
    return this.appService.signIn(username, password);
  }
}
