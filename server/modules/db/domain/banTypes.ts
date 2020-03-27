import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BanTypes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    type: string;
}
