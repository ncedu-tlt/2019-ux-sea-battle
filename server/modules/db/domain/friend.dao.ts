import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";
import { FriendStatusEnum } from "./friend-status.enum";

@Entity()
export class FriendDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UserDAO>;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "friend_id" })
    friend: Promise<UserDAO>;

    @Column({
        type: "enum",
        enum: FriendStatusEnum,
        default: FriendStatusEnum.WAITING
    })
    status: FriendStatusEnum;
}
