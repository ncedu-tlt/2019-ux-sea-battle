import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("shop_categories")
export class ShopCategoryDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
