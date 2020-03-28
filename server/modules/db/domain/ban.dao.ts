import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { BanTypeDAO } from "./banType";
import { UserDAO } from "./user.dao";

@Entity()
export class BanDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDAO, {
        nullable: false,
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: UserDAO;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @BeforeInsert()
    updateDate(): void {
        this.createdAt = new Date();
    }

    @Column({ name: "end_at", type: "timestamp", nullable: false })
    endAt: Date;

    @Column({ nullable: false })
    reason: string;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @OneToOne(() => UserDAO, {
        nullable: false,
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "banned_by" })
    bannedBy: UserDAO;

    @OneToOne(() => UserDAO, {
        nullable: false,
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "removed_by" })
    removedBy: UserDAO;

    @OneToOne(() => BanTypeDAO, {
        nullable: false,
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "type_id" })
    type: BanTypeDAO;
}
