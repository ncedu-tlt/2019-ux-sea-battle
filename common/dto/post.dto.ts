import { UserDAO } from "../../server/modules/db/domain/user.dao";

export interface PostDTO {
    title: string;
    shortText: string;
    fullText: string;
    createdAt: Date;
    tags?: string[];
    author: UserDAO;
}
