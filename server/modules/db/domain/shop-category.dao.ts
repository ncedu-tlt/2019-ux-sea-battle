import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShopCategoryDAO {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
}
