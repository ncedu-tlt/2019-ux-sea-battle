import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { BanTypes } from "./banTypes";
import { UsersDao } from "./users.dao";

@Entity()
export class BansDao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: UsersDao;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @Column({ name: "end_at", type: "timestamp", nullable: false })
    endAt: Date;

    @Column({ nullable: false })
    reason: string;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @OneToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "banned_by" })
    bannedBy: UsersDao;

    @OneToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "removed_by" })
    removedBy: UsersDao;

    @OneToOne(() => BanTypes)
    @JoinColumn({ name: "type_id" })
    typeId: number;

    @BeforeInsert()
    updateDate(): void {
        this.createdAt = new Date();
    }
}
