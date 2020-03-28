import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { GameModeDAO } from "./gameMode.dao";
import { GameStatuseDAO } from "./gameStatuse.dao";

@Entity()
export class GameDAO {
    @PrimaryGeneratedColumn() id: number;

    @OneToOne(() => GameModeDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_mode_id" })
    gameMode: Promise<GameModeDAO>;

    @OneToOne(() => GameStatuseDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_status_id" })
    gameStatus: Promise<GameStatuseDAO>;

    @Column({ name: "room_name", nullable: false }) roomName: string;

    @Column({ name: "is_private", nullable: false }) isPrivate: boolean;

    @Column({ name: "created_at", type: "timestamp" }) createdAt: Date;

    @BeforeInsert()
    updateDate(): void {
        this.createdAt = new Date();
    }
}
