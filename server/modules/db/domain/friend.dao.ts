import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserDAO } from "./user.dao";

@Entity()
export class FriendDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UserDAO>;

    @ManyToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "friend_id" })
    friend: Promise<UserDAO>;
}
