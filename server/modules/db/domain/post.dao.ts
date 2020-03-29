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

    @Column()
    title: string;

    @Column({ name: "short_text" })
    shortText: string;

    @Column({ name: "full_text" })
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
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "author_id" })
    author: Promise<UserDAO>;
}
