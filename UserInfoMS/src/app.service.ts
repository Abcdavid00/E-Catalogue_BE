import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './entities/userinfo.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ContentType, parseContentType } from './entities/content-type.enum';
import { Favorite } from './entities/favorite.entity';
import { FavoriteCollection } from './entities/favorite-collection.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(FavoriteCollection)
    private readonly favoriteCollectionRepository: Repository<FavoriteCollection>,
  ) {}

  getHello(): string {
    return 'UserInfoMS Online!';
  }

  async getUserInfo(id: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({
      where: { id },
    });
    if (!userInfo) {
      throw new RpcException('User info not found');
    }
    return userInfo;
  }

  async updateUserInfo(id: number, userInfo: UserInfo): Promise<UserInfo> {
    let existingUserInfo = await this.userInfoRepository.findOne({
      where: { id },
    });
    if (!existingUserInfo) {
      userInfo.id = id;
      return this.userInfoRepository.save(userInfo);
    }
    userInfo = {
      ...userInfo,
      id: existingUserInfo.id,
      profile_image: existingUserInfo.profile_image,
    }
    existingUserInfo = {
      ...existingUserInfo,
      ...userInfo,
    }
    return this.userInfoRepository.save(userInfo);
  }

  async setProfileImage(id: number, profileImage: string): Promise<UserInfo> {
    let existingUserInfo = await this.userInfoRepository.findOne({
      where: { id },
    });
    if (!existingUserInfo) {
      throw new RpcException('User info not found');
    }
    existingUserInfo = {
      ...existingUserInfo,
      profile_image: profileImage,
    }
    return this.userInfoRepository.save(existingUserInfo);
  }
  
  async createCollection(param: {userId: number, name: string, image: string}): Promise<FavoriteCollection> {
    const collection = this.favoriteCollectionRepository.create({
      userId: param.userId,
      name: param.name,
      image: param.image,
    });
    return this.favoriteCollectionRepository.save(collection);
  }

  async updateCollection(param: {id: number, name?: string, image?: string}): Promise<FavoriteCollection> {
    if (!param.id) {
      throw new RpcException('Collection id not specified');
    }
    const collection = await this.favoriteCollectionRepository.findOne({
      where: { id: param.id },
    });
    if (!collection) {
      throw new RpcException('Collection not found');
    }
    if (param.name) {
      collection.name = param.name;
    }
    if (param.image) {
      collection.image = param.image;
    }
    return this.favoriteCollectionRepository.save(collection);
  }

  async deleteCollection(param: {id: number}): Promise<FavoriteCollection> {
    if (!param.id) {
      throw new RpcException('Collection id not specified');
    }
    const collection = await this.favoriteCollectionRepository.findOne({
      where: { id: param.id },
    });
    if (!collection) {
      throw new RpcException('Collection not found');
    }
    return this.favoriteCollectionRepository.remove(collection);
  }

  async getCollection(param: {id: number}): Promise<FavoriteCollection> {
    console.log('getCollection', param.id)
    return this.favoriteCollectionRepository.findOne({
      where: { 
        id: param.id,
      },
      relations: ['favorites'],
    });
  }

  async getCollectionsByUser(param: {userId: number}): Promise<FavoriteCollection[]> {
    return this.favoriteCollectionRepository.find({
      where: { 
        userId: param.userId,
       },
      relations: ['favorites'],
    });
  }

  async addFavorite(param: {
    userId: number,
    contentId: number,
    contentType: string,
    collectionId: number,
  }): Promise<Favorite> {
    const contentType = parseContentType(param.contentType);

    const collection = await this.favoriteCollectionRepository.findOne({
      where: {
        id: param.collectionId,
        userId: param.userId,
       },
    });

    if (!collection) {
      throw new RpcException('Collection not found');
    }

    const favorite = this.favoriteRepository.create({
      contentId: param.contentId,
      contentType: contentType,
      collection: collection
    });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(param: {
    id: number,
  }) {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        id: param.id,
       },
    });

    if (!favorite) {
      throw new RpcException('Favorite not found');
    }

    return this.favoriteRepository.remove(favorite);
  }

  async getFavorite(param: {
    userId: number,
    contentType: string,
    contentId: number
  }): Promise<Boolean> {
    const contentType = parseContentType(param.contentType);

    const favorite = await this.favoriteRepository.createQueryBuilder("favorite")
      .innerJoinAndSelect("favorite.collection", "collection")
      .where("collection.userId = :userId", { userId: param.userId })
      .andWhere("favorite.contentType = :contentType", { contentType: contentType })
      .andWhere("favorite.contentId = :contentId", { contentId: param.contentId })
      .getOne();
    return !!favorite;
  }

  

}


