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
        nullable: false,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "category_id" })
    category: Promise<ShopCategoryDAO>;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ type: "float", nullable: false })
    price: number;

    @Column({ name: "image_url", nullable: true })
    imageUrl: string;
}
