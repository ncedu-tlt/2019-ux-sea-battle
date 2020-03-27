import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    tag: string;

    @Column({ nullable: false })
    slug: string;
}
