import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatusesDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
