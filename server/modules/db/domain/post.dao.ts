import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";

@Entity("posts")
export class PostDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ name: "short_text" })
    shortText: string;

    @Column({ name: "full_text" })
    fullText: string;

    @Column({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    @Column("text", {
        array: true,
        nullable: true
    })
    tags: string[];

    @ManyToOne(
        () => UserDAO,
        user => user.posts,
        {
            eager: true
        }
    )
    @JoinColumn({ name: "author_id" })
    author: UserDAO;
}
