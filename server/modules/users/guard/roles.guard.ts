import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler()
        );
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasRole = () => roles.includes(user.role);

        if (user && user.role && hasRole()) return true;

        throw new HttpException("users/notPermission", HttpStatus.FORBIDDEN);
    }
}
