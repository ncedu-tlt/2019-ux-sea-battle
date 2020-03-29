import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tag: string;

    @Column()
    slug: string;
}
