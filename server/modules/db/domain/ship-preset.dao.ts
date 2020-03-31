import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";
import { GameModeDAO } from "./game-mode.dao";

@Entity("ship_presets")
export class ShipPresetDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: string;

    @Column()
    name: string;

    @ManyToOne(() => UserDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UserDAO>;

    @ManyToOne(() => GameModeDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_mode_id" })
    gameMode: Promise<GameModeDAO>;

    @Column({ name: "field_size" })
    fieldSize: number;
}
