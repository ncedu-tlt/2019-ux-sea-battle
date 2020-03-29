import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserDAO } from "./user.dao";
import { PostDAO } from "./post.dao";

@Entity()
export class PostLikeDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UserDAO>;

    @ManyToOne(() => PostDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "post_id" })
    post: Promise<PostDAO>;
}
