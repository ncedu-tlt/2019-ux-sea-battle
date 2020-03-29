import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { ShopCategoryDAO } from "./shop-category.dao";

@Entity()
export class ShopItemDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ShopCategoryDAO, {
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

    @Column({ name: "image_url", nullable: true })
    imageUrl: string;
}
