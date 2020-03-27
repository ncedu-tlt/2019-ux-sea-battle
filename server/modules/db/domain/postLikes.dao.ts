import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersDao } from "./users.dao";
import { PostsDao } from "./posts.dao";

@Entity()
export class PostLikesDao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: Promise<UsersDao>;

    @ManyToOne(() => PostsDao, { nullable: false })
    @JoinColumn({ name: "post_id" })
    post: Promise<PostsDao>;
}
