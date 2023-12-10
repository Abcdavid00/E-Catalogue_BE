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


}
