import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { ShopCategoryDAO } from "./shop-category.dao";

@Entity("shop_items")
export class ShopItemDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ShopCategoryDAO, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "category_id" })
    category: Promise<ShopCategoryDAO>;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: "float" })
    price: number;

    @Column({
        name: "image_url",
        nullable: true
    })
    imageUrl: string;
}
