import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import clientsModule from 'src/config/microservices.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtModule } from './jwt.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    clientsModule,
    PassportModule,
    jwtModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
