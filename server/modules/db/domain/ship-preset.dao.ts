import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";

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

    @Column({ name: "field_size" })
    fieldSize: number;
}
