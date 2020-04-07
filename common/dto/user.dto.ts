import { RoleEnum } from "../../server/modules/db/domain/role.enum";
import { UserStatusEnum } from "../../server/modules/db/domain/user-status.enum";

export interface UserDTO {
    id: number;
    nickname: string;
    email: string;
    avatarUrl: string;
    role: RoleEnum;
    balance: number;
    experience: number;
    isAnon: boolean;
    status: UserStatusEnum;
}
