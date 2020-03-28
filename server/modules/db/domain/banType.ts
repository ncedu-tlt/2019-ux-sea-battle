import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BanTypeDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    type: string;
}
