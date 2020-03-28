import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserStatusDao {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: false }) name: string;
}
