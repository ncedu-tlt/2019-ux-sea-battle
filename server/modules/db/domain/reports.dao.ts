import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UsersDao } from "./users.dao";
import { ReportStatusesDao } from "./reportStatuses.dao";

@Entity()
export class ReportsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "target_id" })
    targetId: UsersDao;

    @OneToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "created_by" })
    createdBy: UsersDao;

    @Column({ nullable: false })
    reason: string;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @BeforeInsert()
    updateDates(): void {
        this.createdAt = new Date();
    }

    @OneToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "processed_by" })
    processedBy: UsersDao;

    @OneToOne(() => ReportStatusesDao, { nullable: false })
    @JoinColumn({ name: "status_id" })
    statusId: ReportsDao;
}
