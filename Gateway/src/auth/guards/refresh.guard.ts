import { AuthGuard } from "@nestjs/passport";
import { refreshSN } from "../strategies.module";

export class RefreshGuard extends AuthGuard(refreshSN) {}