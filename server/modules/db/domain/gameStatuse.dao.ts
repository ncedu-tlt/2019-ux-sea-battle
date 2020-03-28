import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatuseDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
