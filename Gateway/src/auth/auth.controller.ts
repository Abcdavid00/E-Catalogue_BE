import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { TokensDto } from './dto/tokens.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginDto})
    @ApiOkResponse({ type: TokensDto })
    async login(@Request() req): Promise<TokensDto> {
        return this.authService.generateTokens(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto })
    getProfile(@Request() req): Promise<UserDto> {
        return req.user;
    }

    @UseGuards(RefreshGuard)
    @Get('refresh')
    @ApiBearerAuth()
    @ApiOkResponse({ type: TokensDto })
    async refresh(@Request() req): Promise<TokensDto> {
        return this.authService.generateTokens(req.user);
    }
}
