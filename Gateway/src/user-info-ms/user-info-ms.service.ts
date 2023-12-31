import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserInfo } from './dto/user-info.dto';
import { UserInfoMSName } from 'src/config/microservices.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { FileServerService } from 'src/file-server/file-server.service';

@Injectable()
export class UserInfoMsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly fileServerService: FileServerService,
        @Inject(UserInfoMSName)
        private readonly userInfoClient: ClientProxy
    ) {}

    async send(param: {
        cmd: string,
        data: any
    }): Promise<any> {
        try {
            const res: any = await firstValueFrom(
                this.userInfoClient.send<any>({ cmd: param.cmd }, param.data)
            )
            return res;
        } catch (error) {
            throw new BadRequestException('UserInfoMS: ' + error.message);
        }
    }

    async getUserInfo(id: number): Promise<UserInfo> {
        try {
            const res: UserInfo = await firstValueFrom(
                this.userInfoClient.send<UserInfo>({ cmd: 'getUserInfo' }, {id})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateUserInfo(id: number, userInfo: UserInfo): Promise<UserInfo> {
        const user = await this.usersService.getUser(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        try {
            const res: UserInfo = await firstValueFrom(
                this.userInfoClient.send<UserInfo>({ cmd: 'updateUserInfo' }, {id, userInfo})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async setProfileImage(id: number, profileImage: Express.Multer.File): Promise<UserInfo> {
        const user = await this.usersService.getUser(id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const image = await this.fileServerService.uploadImage(profileImage);
        try {
            const res: UserInfo = await firstValueFrom(
                this.userInfoClient.send<UserInfo>({ cmd: 'setProfileImage' }, {id, profileImage: image})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async createCollection(param: {userId: number, name: string, image: Express.Multer.File}): Promise<any> {
        const image = await this.fileServerService.uploadImage(param.image);
        return this.send({
            cmd: 'createCollection',
            data: {
                userId: param.userId,
                name: param.name,
                image: image,
            }
        })
    }

    async updateCollection(param: {id: number, name?: string, image?: Express.Multer.File}): Promise<any> {
        const image = param.image ? await this.fileServerService.uploadImage(param.image) : undefined;
        return this.send({
            cmd: 'updateCollection',
            data: {
                id: param.id,
                name: param.name,
                image: image,
            }
        })
    }

    async deleteCollection(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'deleteCollection',
            data: {
                id: param.id,
            }
        })
    }

    async getCollection(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'getCollection',
            data: {
                id: param.id,
            }
        })
    }

    async getCollectionsByUser(param: {userId: number}): Promise<any> {
        return this.send({
            cmd: 'getCollectionsByUser',
            data: {
                userId: param.userId,
            }
        })
    }

    async addFavorite(param: {userId: number, collectionId: number, contentId: number, contentType: string}): Promise<any> {
        return this.send({
            cmd: 'addFavorite',
            data: {
                userId: param.userId,
                collectionId: param.collectionId,
                contentId: param.contentId,
                contentType: param.contentType,
            }
        })
    }

    async removeFavorite(param: {id: number}): Promise<any> {
        return this.send({
            cmd: 'removeFavorite',
            data: {
                id: param.id,
            }
        })
    }

    async getFavorite(param: {
        userId: number,
        collectionId: number,
        contentId: number,
        contentType: string
    }): Promise<any> {
        return this.send({
            cmd: 'getFavorite',
            data: {
                userId: param.userId,
                collectionId: param.collectionId,
                contentId: param.contentId,
                contentType: param.contentType,
            }
        })
    }

    async getStoreFollowByUser(param: {
        userId: number,
    }): Promise<any> {
        return this.send({
            cmd: 'getStoreFollowByUser',
            data: {
                userId: param.userId,
            }
        })
    }

    async getStoreFollowByStore(param: {
        storeId: number,
    }): Promise<any> {
        return this.send({
            cmd: 'getStoreFollowByStore',
            data: {
                storeId: param.storeId,
            }
        })
    }

    async setStoreFollow(param: {
        userId: number,
        storeId: number,
        follow: boolean,
    }): Promise<any> {
        return this.send({
            cmd: 'setStoreFollow',
            data: {
                userId: param.userId,
                storeId: param.storeId,
                follow: param.follow,
            }
        })
    }
}
