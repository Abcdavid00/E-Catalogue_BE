import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UsersMSName } from 'src/config/microservices.module';
import { User } from './dto/user.dto';

@Injectable()
export class UsersService {

    constructor(
        @Inject(UsersMSName)
        private readonly UsersClient: ClientProxy
    ) {}

    async isUsernameAvailable(username: string): Promise<boolean> {
        console.log('Looking for username: ', username)
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
        console.log('Looking for email: ', email)
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
        console.log(`Creating user: Username: ${username}\tEmail: ${email}\tPassword: ${password}`)
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'createUser' }, {username, email, password})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getUser(id: number): Promise<User> {
        console.log(`Getting user with id: ${id}`)
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'getUser' }, id)
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findUserByUsername(username: string): Promise<User> {
        console.log(`Getting user with username: ${username}`)
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
        console.log(`Getting user with email: ${email}`)
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
        console.log(`Signing in user with username: ${username}\tPassword: ${password}`)
        try {
            const res: User =  await firstValueFrom(
                this.UsersClient.send<User>({ cmd: 'signIn' }, {username, password})
            )
            return res;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
