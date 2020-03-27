import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { ShopCategoriesDao } from "./shopCategories.dao";

@Entity()
export class ShopItemsDao {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ShopCategoriesDao, { nullable: false })
    @JoinColumn({ name: "category_id" })
    categoryId: ShopCategoriesDao;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ type: "float", nullable: false })
    price: number;

    @Column({ name: "image_url" })
    imageUrl: string;
}
