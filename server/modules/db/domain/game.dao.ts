import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GameStatusEnum } from "./game-status.enum";
import { GameModeEnum } from "./game-mode.enum";

@Entity("games")
export class GameDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: GameModeEnum
    })
    gameMode: GameModeEnum;

    @Column({
        type: "enum",
        enum: GameStatusEnum
    })
    status: GameStatusEnum;

    @Column({
        name: "room_name",
        nullable: true
    })
    roomName: string;

    @Column({ name: "is_private" })
    isPrivate: boolean;

    @Column({
        name: "created_at",
        type: "timestamp"
    })
    createdAt: Date;
}
