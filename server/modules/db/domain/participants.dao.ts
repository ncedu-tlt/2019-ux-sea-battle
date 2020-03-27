import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UsersDao } from "./users.dao";
import { GamesDao } from "./games.dao";

@Entity()
export class ParticipantsDao {
    @PrimaryGeneratedColumn() id: number;

    @OneToOne(() => UsersDao, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: Promise<UsersDao>;

    @OneToOne(() => GamesDao, { nullable: false })
    @JoinColumn({ name: "game_id" })
    game: Promise<GamesDao>;

    @Column({ name: "is_host", default: false }) isHost: boolean;

    @Column({ name: "is_winner", default: false }) isWinner: boolean;

    @Column({ default: 0 }) score: number;

    @Column({ default: 0 }) shots: number;

    @Column({ default: 0 }) hits: number;
}
