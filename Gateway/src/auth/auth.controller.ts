import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    // @ApiParam({ name: 'username', type: String, description: 'User\'s username or email' })
    // @ApiParam({ name: 'password', type: String, description: 'User\'s password' })
    // @ApiBody({ name: 'username', type: String })
    @Post('login')
    @ApiBody({ type: LoginDto})
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }
}
