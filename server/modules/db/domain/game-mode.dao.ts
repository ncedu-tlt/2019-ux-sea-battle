import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("game_modes")
export class GameModeDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}
