import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            if (!payload.isRefreshToken) {
                throw new BadRequestException('Invalid refresh token');
            }
            const user = await this.usersService.getUser(payload.sub);
            return this.generateTokens(user);
        } catch (error) {
            throw new BadRequestException('Invalid refresh token');
        }
    }

    async generateTokens(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role, email: user.email };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: jwtExpiresIn }),
            refresh_token: this.jwtService.sign({...payload, isRefreshToken: true}, { expiresIn: jwtRefreshExpiresIn })
        }
    }
}
