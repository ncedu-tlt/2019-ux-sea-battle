import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserDAO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}