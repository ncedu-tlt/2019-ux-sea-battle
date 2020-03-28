import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendStatusesDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    status: string;
}
