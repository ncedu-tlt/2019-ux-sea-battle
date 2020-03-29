import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendStatusDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;
}
