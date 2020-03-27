import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    ManyToMany,
    PrimaryGeneratedColumn,
    BeforeInsert
} from "typeorm";
import { UsersDao } from "./users.dao";
import { TagsDao } from "./tags.dao";

@Entity()
export class PostsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ name: "short_text", nullable: false })
    shortText: string;

    @Column({ name: "full_text", nullable: false })
    fullText: string;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @BeforeInsert()
    updateDates(): void {
        this.createdAt = new Date();
    }

    @ManyToMany(() => TagsDao, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    tags: Promise<TagsDao[]>;

    @ManyToOne(() => UsersDao, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "author_id" })
    authorId: Promise<UsersDao>;
}
