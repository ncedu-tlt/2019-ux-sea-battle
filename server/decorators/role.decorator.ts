import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { RoleEnum } from "../modules/db/domain/role.enum";

export function Roles(roles: RoleEnum) {
    return applyDecorators(
        SetMetadata("roles", roles),
        UseGuards(AuthGuard(), RolesGuard)
    );
}
