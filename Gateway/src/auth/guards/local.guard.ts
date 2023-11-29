import { Injectable } from "@nestjs/common";
import { localSN } from "../strategies.module";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard(localSN) {}