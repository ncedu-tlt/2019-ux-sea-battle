import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AchievementDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    reward: number;
}
