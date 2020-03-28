import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserStatusesDao {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false }) name: string;
}
