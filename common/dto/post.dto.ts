import { UserDTO } from "./user.dto";

export interface PostDTO {
    id?: number;
    title: string;
    shortText: string;
    fullText: string;
    createdAt: Date;
    tags?: string[];
    author: UserDTO;
}
