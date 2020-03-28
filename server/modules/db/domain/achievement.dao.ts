import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AchievementDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    reward: number;
}