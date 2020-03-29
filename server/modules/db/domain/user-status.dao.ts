import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserStatusDAO {
    @PrimaryGeneratedColumn() id: number;

    @Column() name: string;
}
