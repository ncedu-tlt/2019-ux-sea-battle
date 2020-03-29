import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameModeDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}
