import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShopCategoriesDao {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    name: string;
}
