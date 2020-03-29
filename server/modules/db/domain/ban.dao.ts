import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { BanTypeEnum } from "./ban-type.enum";
import { UserDAO } from "./user.dao";

@Entity()
export class BanDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDAO, {
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

    @Column({ name: "end_at", type: "timestamp" })
    endAt: Date;

    @Column()
    reason: string;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @OneToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "banned_by" })
    bannedBy: Promise<UserDAO>;

    @OneToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "removed_by" })
    removedBy: Promise<UserDAO>;

    @Column({
        type: "enum",
        enum: BanTypeEnum
    })
    type: BanTypeEnum;
}
