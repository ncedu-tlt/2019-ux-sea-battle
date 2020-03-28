import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UserDAO } from "./user.dao";

@Entity()
export class ShipPresetDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    field: string;

    @ManyToOne(() => UserDAO, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UserDAO>;

    @Column({ name: "field_size", nullable: false })
    fieldSize: number;
}
