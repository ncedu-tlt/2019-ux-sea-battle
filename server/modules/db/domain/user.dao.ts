import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    nickname: string;
}
