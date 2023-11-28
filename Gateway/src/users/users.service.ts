import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UsersMSName } from 'src/config/microservices.module';

@Injectable()
export class UsersService {

    constructor(
        @Inject(UsersMSName)
        private readonly UsersClient: ClientProxy
    ) {}

    async isUsernameAvailable(username: string): Promise<boolean> {
        return await firstValueFrom(
            this.UsersClient.send<boolean>({ cmd: 'isUsernameAvailable' }, username)
        );
    }

    async isEmailAvailable(email: string): Promise<boolean> {
        return await firstValueFrom(
            this.UsersClient.send<boolean>({ cmd: 'isEmailAvailable' }, email)
        );
    }

    async createUser(username: string, email: string, password: string): Promise<any> {
        return await firstValueFrom(
            this.UsersClient.send<any>({ cmd: 'createUser' }, { username, email, password })
        );
    }

    async getUser(id: number): Promise<any> {
        return await firstValueFrom(
            this.UsersClient.send<any>({ cmd: 'getUser' }, id)
        );
    }

    async findUserByUsername(username: string): Promise<any> {
        return await firstValueFrom(
            this.UsersClient.send<any>({ cmd: 'findUserByUsername' }, username)
        );
    }

    async findUserByEmail(email: string): Promise<any> {
        return await firstValueFrom(
            this.UsersClient.send<any>({ cmd: 'findUserByEmail' }, email)
        );
    }

    async signIn(username: string, password: string): Promise<any> {
        return await firstValueFrom(
            this.UsersClient.send<any>({ cmd: 'signIn' }, { username, password })
        );
    }

    

}
