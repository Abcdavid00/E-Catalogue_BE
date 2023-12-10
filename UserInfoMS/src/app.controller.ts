import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserInfo } from './entities/userinfo.entity';

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

  @MessagePattern({ cmd: 'getUserInfo' })
  async getUserInfo(param: {id: number}): Promise<UserInfo> {
    return this.appService.getUserInfo(param.id);
  }

  @MessagePattern({ cmd: 'updateUserInfo' })
  async updateUserInfo(param: {id: number, userInfo: UserInfo}): Promise<UserInfo> {
    return this.appService.updateUserInfo(param.id, param.userInfo);
  }

  @MessagePattern({ cmd: 'setProfileImage' })
  async setProfileImage(param: {id: number, profileImage: string}): Promise<UserInfo> {
    return this.appService.setProfileImage(param.id, param.profileImage);
  }
}
