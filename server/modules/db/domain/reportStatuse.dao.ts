import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportStatuseDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
