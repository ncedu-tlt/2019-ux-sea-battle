import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportStatusDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
