import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserStatuseDAO {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false }) name: string;
}
