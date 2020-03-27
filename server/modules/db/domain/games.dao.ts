import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { GameModesDao } from "./gameModes.dao";
import { GameStatusesDao } from "./gameStatuses.dao";

@Entity()
export class GamesDao {
    @PrimaryGeneratedColumn() id: number;

    @OneToOne(() => GameModesDao, { nullable: false, cascade: true })
    @JoinColumn({ name: "game_mode_id" })
    gameMode: Promise<GameModesDao>;

    @OneToOne(() => GameStatusesDao, { nullable: false, cascade: true })
    @JoinColumn({ name: "game_status_id" })
    gameStatus: Promise<GameStatusesDao>;

    @Column({ name: "room_name", nullable: false }) roomName: string;

    @Column({ name: "is_private", nullable: false }) isPrivate: boolean;

    @Column({ name: "created_at", type: "timestamp" }) createdAt: Date;

    @BeforeInsert()
    updateDate(): void {
        this.createdAt = new Date();
    }
}
