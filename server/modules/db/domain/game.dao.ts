import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { GameModeDAO } from "./game-mode.dao";
import { GameStatusEnum } from "./game-status.enum";

@Entity("games")
export class GameDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => GameModeDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_mode_id" })
    gameMode: Promise<GameModeDAO>;

    @Column({
        type: "enum",
        enum: GameStatusEnum
    })
    status: GameStatusEnum;

    @Column({ name: "room_name", nullable: true })
    roomName: string;

    @Column({ name: "is_private" })
    isPrivate: boolean;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;
}
