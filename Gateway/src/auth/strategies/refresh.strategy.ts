import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtSecret } from "../jwt.module";
import { refreshSN } from "../strategies.module";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, refreshSN) {
    constructor(
        private readonly authService: AuthService
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: jwtSecret
            }
        );
    }

    async validate(payload: any): Promise<any> {
        if (!payload.isRefreshToken) {
            throw new BadRequestException('Invalid refresh token');
        }
        return {
            id: payload.sub,
            username: payload.username,
            role: payload.role
        }
    }
}