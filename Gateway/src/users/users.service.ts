import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UsersMSName } from 'src/config/microservices.module';
import { User, UserRole } from './dto/user.dto';

@Injectable()
export class UsersService {

    constructor(
        @Inject(UsersMSName)
        private readonly UsersClient: ClientProxy
    ) {}

    async isUsernameAvailable(username: string): Promise<boolean> {
        try {
            const res: boolean =  await firstValueFrom(
                this.UsersClient.send<boolean>({ cmd: 'isUsernameAvailable' }, {username})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async isEmailAvailable(email: string): Promise<boolean> {
        try {
            const res: boolean =  await firstValueFrom(
                this.UsersClient.send<boolean>({ cmd: 'isEmailAvailable' }, {email})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async createUser(username: string, email: string, password: string): Promise<User> {
        try {
            const role = UserRole.CUSTOMER;
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'createUser' }, {username, email, password, role})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async initAdmin(): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'initAdmin' }, {})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getUser(id: number): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'getUser' }, id)
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async changeRole(param: {id: number, role: string}): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'changeRole' }, param)
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findUserByUsername(username: string): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'findUserByUsername' }, username)
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'findUserByEmail' }, email)
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async signIn(username: string, password: string): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'signIn' }, {username, password})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'changePassword' }, {id, oldPassword, newPassword})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async changeEmail(id: number, newEmail: string): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'changeEmail' }, {id, newEmail})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async changeUsername(id: number, newUsername: string): Promise<User> {
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'changeUsername' }, {id, newUsername})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
