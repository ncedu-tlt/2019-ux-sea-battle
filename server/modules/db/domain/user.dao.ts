import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    nickname: string;
}
