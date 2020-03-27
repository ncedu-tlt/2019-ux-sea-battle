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
    category: Promise<ShopCategoriesDao>;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ type: "float", nullable: false })
    price: number;

    @Column({ name: "image_url", nullable: true })
    imageUrl: string;
}
