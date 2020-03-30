import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { ShopItemDAO } from "./shop-item.dao";
import { AchievementDAO } from "./achievement.dao";
import { RoleEnum } from "./role.enum";
import { UserStatusEnum } from "./user-status.enum";
import { PostDAO } from "./post.dao";

@Entity("users")
export class UserDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ unique: true })
    nickname: string;

    @Column({ nullable: true })
    password: string;

    @Column({ name: "avatar_url", nullable: true })
    avatarUrl: string;

    @Column({
        type: "enum",
        enum: RoleEnum,
        default: RoleEnum.USER
    })
    role: RoleEnum;

    @Column({ type: "float", default: 0 })
    balance: number;

    @Column({ type: "float", default: 0 })
    experience: number;

    @Column({ name: "is_anon", default: true })
    isAnon: boolean;

    @Column({ name: "is_dnd", default: false })
    isDnd: boolean;

    @Column({
        type: "enum",
        enum: UserStatusEnum
    })
    status: UserStatusEnum;

    @ManyToMany(() => ShopItemDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    @JoinColumn({ name: "bought_items" })
    boughtItems: Promise<ShopItemDAO[]>;

    @ManyToMany(() => AchievementDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    achievements: Promise<AchievementDAO[]>;

    @ManyToMany(() => PostDAO, {
        nullable: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinTable()
    posts: Promise<PostDAO[]>;
}
