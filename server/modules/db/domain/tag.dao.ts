import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tags")
export class TagDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tag: string;

    @Column()
    slug: string;
}
