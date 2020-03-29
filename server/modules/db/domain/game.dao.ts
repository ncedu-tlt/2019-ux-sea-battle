import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { GameModeDAO } from "./game-mode.dao";
import { GameStatusEnum } from "./game-status.dao";

@Entity()
export class GameDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => GameModeDAO, {
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

    @Column({ name: "room_name" })
    roomName: string;

    @Column({ name: "is_private" })
    isPrivate: boolean;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;
}
