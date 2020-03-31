import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";
import { ReportStatusEnum } from "./report-status.enum";

@Entity("reports")
export class ReportDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "target_id" })
    target: Promise<UserDAO>;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "created_by" })
    createdBy: Promise<UserDAO>;

    @Column()
    reason: string;

    @Column({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE",
        nullable: true
    })
    @JoinColumn({ name: "processed_by" })
    processedBy: Promise<UserDAO>;

    @Column({
        type: "enum",
        enum: ReportStatusEnum,
        default: ReportStatusEnum.IN_PROCESSING
    })
    status: ReportStatusEnum;
}
