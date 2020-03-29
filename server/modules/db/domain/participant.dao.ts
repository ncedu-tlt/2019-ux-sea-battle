import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";
import { GameDAO } from "./game.dao";

@Entity()
export class ParticipantDAO {
    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UserDAO>;

    @OneToOne(() => GameDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "game_id" })
    game: Promise<GameDAO>;

    @Column({ name: "is_host", default: false }) isHost: boolean;

    @Column({ name: "is_winner", default: false }) isWinner: boolean;

    @Column({ default: 0 }) score: number;

    @Column({ default: 0 }) shots: number;

    @Column({ default: 0 }) hits: number;
}
