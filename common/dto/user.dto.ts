export interface UserDTO {
    id: number;
    email: string;
    nickname?: string;
    password: string;
    avatar_url?: string;
    balance?: number;
    is_dnd?: boolean;
}
