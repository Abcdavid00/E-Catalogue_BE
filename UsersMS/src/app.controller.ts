import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'Hi' })
  ping(_: any): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'isUsernameAvailable' })
  async isUsernameAvailable(param: {username: string}): Promise<boolean> {
    return this.appService.isUsernameAvailable(param.username);
  }

  @MessagePattern({ cmd: 'isEmailAvailable' })
  async isEmailAvailable(email: string): Promise<boolean> {
    return this.appService.isEmailAvailable(email);
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(params: {username: string, email: string, password: string, role: string}): Promise<User> {
    return this.appService.createUser(params.username, params.email, params.password, params.role);
  }

  @MessagePattern({ cmd: 'initAdmin' })
  async initAdmin(): Promise<User> {
    return this.appService.initAdmin();
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(id: number): Promise<any> {
    return this.appService.getUser(id);
  }

  @MessagePattern({ cmd: 'changeRole' })
  async changeRole(params: {id: number, role: string}): Promise<any> {
    return this.appService.changeRole(params);
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
  async signIn(params: {username: string, password: string}): Promise<any> {
    return this.appService.signIn(params.username, params.password);
  }

  @MessagePattern({ cmd: 'changePassword' })
  async changePassword(params: {id: number, oldPassword: string, newPassword: string}): Promise<any> {
    return this.appService.changePassword(params.id, params.oldPassword, params.newPassword);
  }

  @MessagePattern({ cmd: 'changeEmail' })
  async changeEmail(params: {id: number, newEmail: string}): Promise<any> {
    return this.appService.changeEmail(params.id, params.newEmail);
  }

  @MessagePattern({ cmd: 'changeUsername' })
  async changeUsername(params: {id: number, newUsername: string}): Promise<any> {
    return this.appService.changeUsername(params.id, params.newUsername);
  }
}
