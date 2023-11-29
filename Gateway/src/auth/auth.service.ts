import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UsersMSName } from 'src/config/microservices.module';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UsersMSName)
        private readonly UsersClient: ClientProxy,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const User = await firstValueFrom(this.UsersClient.send<any>({ cmd: 'signIn' }, { username, password }))
        if (User) {
            const { password, ...result } = User;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
