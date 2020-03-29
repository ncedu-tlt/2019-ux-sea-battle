import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportStatusDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;
}
