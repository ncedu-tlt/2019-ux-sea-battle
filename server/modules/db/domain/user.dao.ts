import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    OneToMany
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

    @Column({
        nullable: true,
        unique: true
    })
    email: string;

    @Column({ unique: true })
    nickname: string;

    @Column({ nullable: true })
    password: string;

    @Column({
        name: "avatar_url",
        nullable: true
    })
    avatarUrl: string;

    @Column({
        type: "enum",
        enum: RoleEnum,
        default: RoleEnum.USER
    })
    role: RoleEnum;

    @Column({
        type: "float",
        default: 0
    })
    balance: number;

    @Column({
        type: "float",
        default: 0
    })
    experience: number;

    @Column({
        name: "is_anon",
        default: true
    })
    isAnon: boolean;

    @Column({
        type: "enum",
        enum: UserStatusEnum,
        default: UserStatusEnum.OFFLINE
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

    @OneToMany(
        () => PostDAO,
        post => post.author,
        {
            cascade: true,
            onDelete: "CASCADE"
        }
    )
    @JoinTable()
    posts: Promise<PostDAO[]>;
}
