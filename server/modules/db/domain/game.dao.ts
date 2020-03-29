import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { GameModeDAO } from "./game-mode.dao";
import { GameStatusDAO } from "./game-status.dao";

@Entity()
export class GameDAO {
    @PrimaryGeneratedColumn() id: number;

    @OneToOne(() => GameModeDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_mode_id" })
    gameMode: Promise<GameModeDAO>;

    @OneToOne(() => GameStatusDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_status_id" })
    gameStatus: Promise<GameStatusDAO>;

    @Column({ name: "room_name" }) roomName: string;

    @Column({ name: "is_private" }) isPrivate: boolean;

    @Column({ name: "created_at", type: "timestamp" }) createdAt: Date;

    @BeforeInsert()
    updateDate(): void {
        this.createdAt = new Date();
    }
}
