import { AuthGuard } from "@nestjs/passport";
import { jwtSN } from "../strategies.module";

export class JwtAuthGuard extends AuthGuard(jwtSN) {}