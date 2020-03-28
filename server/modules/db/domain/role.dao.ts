import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoleDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;
}
