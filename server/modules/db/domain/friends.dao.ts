import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersDao } from "./users.dao";

@Entity()
export class FriendsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: Promise<UsersDao>;

    @ManyToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "friend_id" })
    friend: Promise<UsersDao>;
}
