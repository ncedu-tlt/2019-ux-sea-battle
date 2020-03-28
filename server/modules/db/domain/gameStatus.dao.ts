import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatusDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
