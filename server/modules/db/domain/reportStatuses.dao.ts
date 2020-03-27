import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportStatusesDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
