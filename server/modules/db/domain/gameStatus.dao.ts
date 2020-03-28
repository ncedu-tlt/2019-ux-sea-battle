import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatusDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
