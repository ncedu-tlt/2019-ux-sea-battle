import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";
import { ReportStatusDAO } from "./reportStatus.dao";

@Entity()
export class ReportDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "target_id" })
    target: Promise<UserDAO>;

    @OneToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "created_by" })
    createdBy: Promise<UserDAO>;

    @Column({ nullable: false })
    reason: string;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @BeforeInsert()
    updateDates(): void {
        this.createdAt = new Date();
    }

    @OneToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "processed_by" })
    processedBy: Promise<UserDAO>;

    @OneToOne(() => ReportStatusDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "status_id" })
    status: Promise<ReportDAO>;
}
