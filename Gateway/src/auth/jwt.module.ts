import { DynamicModule } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"

export const jwtSecret = process.env.JWT_SECRET
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN
export const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN

export const jwtModule: DynamicModule = JwtModule.register({
    secret: jwtSecret,
})

