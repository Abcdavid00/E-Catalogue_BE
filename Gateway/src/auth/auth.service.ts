import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UsersMSName } from 'src/config/microservices.module';
import { UsersService } from '../users/users.service';
import { jwtExpiresIn, jwtRefreshExpiresIn } from './jwt.module';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user = await this.usersService.signIn(username, password);
            return user;
        } catch (error) {
            if (error.message in ['Username not found', 'Username or password is incorrect']) {
                return null;
            }
            throw error;
        }
    }

    async generateTokens(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: jwtExpiresIn }),
            refresh_token: this.jwtService.sign({...payload, isRefreshToken: true}, { expiresIn: jwtRefreshExpiresIn })
        }
    }
}
