import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { UsersDao } from "./users.dao";

@Entity()
export class ShipPresetsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    field: string;

    @ManyToOne(() => UsersDao, {
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user: Promise<UsersDao>;

    @Column({ name: "field_size", nullable: false })
    fieldSize: number;
}
