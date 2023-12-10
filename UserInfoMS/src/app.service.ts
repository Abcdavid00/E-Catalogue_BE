import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './entities/userinfo.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  getHello(): string {
    return 'Hello from UserInfoMS!';
  }

  async getUserInfo(id: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({
      where: { id },
    });
    if (!userInfo) {
      throw new RpcException('User not found');
    }
    return userInfo;
  }

  async updateUserInfo(id: number, userInfo: UserInfo): Promise<UserInfo> {
    let existingUserInfo = await this.userInfoRepository.findOne({
      where: { id },
    });
    if (!existingUserInfo) {
      throw new RpcException('User not found');
    }
    existingUserInfo = {
      ...existingUserInfo,
      ...userInfo,
      id: existingUserInfo.id,
      profile_image: existingUserInfo.profile_image,
    }
    return this.userInfoRepository.save(userInfo);
  }

  async setProfileImage(id: number, profileImage: string): Promise<UserInfo> {
    let existingUserInfo = await this.userInfoRepository.findOne({
      where: { id },
    });
    if (!existingUserInfo) {
      throw new RpcException('User not found');
    }
    existingUserInfo = {
      ...existingUserInfo,
      profile_image: profileImage,
    }
    return this.userInfoRepository.save(existingUserInfo);
  }
}
