import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RolesDao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;
}
