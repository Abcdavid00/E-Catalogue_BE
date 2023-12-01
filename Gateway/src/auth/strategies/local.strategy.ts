import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { localSN } from "../strategies.module";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, localSN) {

    constructor(
        private readonly AuthService: AuthService
    ) {
        super(
            {
                usernameField: 'username',
                // passwordField: 'password'
            }
        );
    }

    async validate(username: string, password: string): Promise<any> {
        console.log("Validating user...");
        const user = await this.AuthService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}