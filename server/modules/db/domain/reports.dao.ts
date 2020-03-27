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

    @OneToOne(() => UsersDao, { nullable: false, cascade: true })
    @JoinColumn({ name: "target_id" })
    target: Promise<UsersDao>;

    @OneToOne(() => UsersDao, { nullable: false, cascade: true })
    @JoinColumn({ name: "created_by" })
    createdBy: Promise<UsersDao>;

    @Column({ nullable: false })
    reason: string;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @BeforeInsert()
    updateDates(): void {
        this.createdAt = new Date();
    }

    @OneToOne(() => UsersDao, { nullable: false, cascade: true })
    @JoinColumn({ name: "processed_by" })
    processedBy: Promise<UsersDao>;

    @OneToOne(() => ReportStatusesDao, { nullable: false, cascade: true })
    @JoinColumn({ name: "status_id" })
    status: Promise<ReportsDao>;
}
