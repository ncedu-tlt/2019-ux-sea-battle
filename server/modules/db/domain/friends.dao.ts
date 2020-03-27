import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersDao } from "./users.dao";

@Entity()
export class FriendsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersDao, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UsersDao>;

    @ManyToOne(() => UsersDao, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "friend_id" })
    friend: Promise<UsersDao>;
}
