import { UserStatusEnum } from "../../server/modules/db/domain/user-status.enum";

export interface CurrentUserDTO {
    nickname: string;
    email: string;
    avatarUrl: string;
    balance: number;
    experience: number;
    isAnon: boolean;
    status: UserStatusEnum;
}
