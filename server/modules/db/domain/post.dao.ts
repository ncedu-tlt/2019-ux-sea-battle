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
import { UserDAO } from "./user.dao";
import { TagDAO } from "./tag.dao";

@Entity()
export class PostDAO {
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

    @ManyToMany(() => TagDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    tags: Promise<TagDAO[]>;

    @ManyToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "author_id" })
    author: Promise<UserDAO>;
}
