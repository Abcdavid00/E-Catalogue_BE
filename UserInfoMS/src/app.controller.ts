import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserInfo } from './entities/userinfo.entity';
import { Favorite } from './entities/favorite.entity';
import { FavoriteCollection } from './entities/favorite-collection.entity';

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

  @MessagePattern({ cmd: 'createCollection' })
  async createCollection(param: {userId: number, name: string, image: string}): Promise<FavoriteCollection> {
    return this.appService.createCollection(param);
  }

  @MessagePattern({ cmd: 'updateCollection' })
  async updateCollection(param: {id: number, name: string, image: string}): Promise<FavoriteCollection> {
    return this.appService.updateCollection(param);
  }

  @MessagePattern({ cmd: 'deleteCollection' })
  async deleteCollection(param: {id: number}): Promise<FavoriteCollection> {
    return this.appService.deleteCollection(param);
  }

  @MessagePattern({ cmd: 'getCollection' })
  async getCollection(param: {id: number}): Promise<FavoriteCollection> {
    return this.appService.getCollection(param);
  }

  @MessagePattern({ cmd: 'getCollectionsByUser' })
  async getCollectionsByUser(param: {userId: number}): Promise<FavoriteCollection[]> {
    return this.appService.getCollectionsByUser(param);
  }

  @MessagePattern({ cmd: 'addFavorite' })
  async addFavorite(param: {userId: number, collectionId: number, contentId: number, contentType: string}): Promise<Favorite> {
    return this.appService.addFavorite(param);
  }

  @MessagePattern({ cmd: 'removeFavorite' })
  async removeFavorite(param: {id: number}): Promise<Favorite> {
    return this.appService.removeFavorite(param);
  }

  @MessagePattern({ cmd: 'getFavorite' })
  async getFavorite(param: {userId: number, collectionId: number, contentId: number, contentType: string}): Promise<Boolean> {
    return this.appService.getFavorite(param);
  }
}
