import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtSecret } from "../jwt.module";
import { jwtSN } from "../strategies.module";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, jwtSN) {
    constructor() {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: jwtSecret
            }
        );
    }

    async validate(payload: any): Promise<any> {
        if (payload.isRefreshToken) {
            throw new BadRequestException('Invalid access token');
        }
        return {
            id: payload.sub,
            username: payload.username,
            role: payload.role
        }
    }
}